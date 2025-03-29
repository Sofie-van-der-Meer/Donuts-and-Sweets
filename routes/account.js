import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator'
import { createAccount, getAccountByEmail } from '../models/account.js';
import { createPlace, getPlaceByData } from '../models/place.js';
import { createAdress } from '../models/adress.js';
import { createClient } from '../models/client.js';

const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(401).json({ error: 'unauthorized'})
    }
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'unauthorized'})
        }
        req.user = decoded
        next()
    })
}

router.get('/', async (req, res) => {
    res.render('account/index',{ loggedIn: false })
})
router.get('/register', async (req, res) => {
    res.render('account/register', {url: 'account'})
})

router.post('/login', async (req, res) => {
    try {
        const account = await getAccountByEmail(req.body.email)
        if (!account) {
           return res.redirect('/account/register')
        }
        console.log('found the email')
    } catch (error) {
        console.log('Internal server error: ', error)
        res.render('account/index',{ loggedIn: false })
    }
    
})

router.post('/register/account', [
    // email
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email'),

    check('email')
        .custom(async (value) => {
            const existingAccount = await getAccountByEmail(value)
            if (existingAccount) {
               return new Error('Email is already taken')
            }
        }),
    // password
    check('confirmPassword')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match');
        }
        return true;
    }),
    check('password')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{12,}$/)
        .withMessage(`Password must be at least 12 characters long, 
            and contain at least one digit, one lowercase letter, 
            one uppercase letter, and one special character.`),

], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {

        const { email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const accountData = {
            email, 
            password: hashedPassword
        }

        const newAccount = await createAccount(accountData)
        console.log(newAccount)
        req.session.accountId = newAccount.id

        res.render('account/register', {url: 'client'})
    } catch (error) {
        console.log('Internal server error: ', error)
        res.render('account/index',{ loggedIn: false })
    }
    
})

router.post('/register/client', [
    // name
    check('firstName')
        .isLength({ min: 3, max: 50 })
        .withMessage('First name must be between 3 and 50 characters'),
    check('lastName')
        .isLength({ min: 3, max: 50 })
        .withMessage('Lastname must be between 3 and 50 characters'),
    check('firstName').trim().escape(),
    check('lastName').trim().escape(),
    // number
    check('phoneNr')
        .matches(/^[0-9]{8,9}$/)
        .withMessage('Phone number must be 8-9 digits long'),
    // Street
    check('street')
        .isLength({ min: 3, max: 50 })
        .withMessage('Street must be between 3 and 50 characters.')
        .matches(/^[a-zA-Z0-9\s,.'-]+$/)
        .withMessage('Street can only contain letters, digits, spaces, commas, periods, apostrophes, and hyphens.'),

    // House Number
    check('houseNr')
        .isInt({ min: 1, max: 99999 })
        .withMessage('House number must be a positive integer between 1 and 99999.'),

    // Bus
    check('bus')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage('Bus can only contain letters and numbers.'),

    // Zip Code 
    check('zipCode')
        .isLength({ min: 4, max: 4 })
        .withMessage('Zip code must be exactly 4 digits.')
        .isInt()
        .withMessage('Zip code must be numeric.')
        .matches(/^\d{4}$/)
        .withMessage('Zip code must contain exactly 4 digits.'),

    // Place Name
    check('placeName')
        .isLength({ min: 3, max: 50 })
        .withMessage('City name must be between 3 and 50 characters.')
        .matches(/^[a-zA-Z\-]+$/)
        .withMessage('City name can only contain letters and hyphens.')

], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {

        const accountId = req.session.accountId
        if (!accountId && !0) {
            return res.status(400).send('Account not found. Please complete the first step of the registration', req.session.accountId)
        }
        const { firstName, lastName, phoneNr, street, houseNr, bus, zipCode, placeName } = req.body

        const placeData = { zipCode, placeName }
        console.log('placeData: ', placeData)
        const existingPlace = await getPlaceByData(placeData)
        console.log('existingPlace: ', existingPlace)
        let place
        if (existingPlace) {
            place = existingPlace
        } else {
            place = await createPlace(placeData)
        }
        const placeId = place.id
        console.log('place: ', place)
        console.log('placeId: ', placeId)
        const adressData = { street, houseNr, bus, placeId}
        const adress = await createAdress(adressData)
        const clientData = { firstName, lastName, phoneNr, adressId: adress.id, accountId }
        const client = await createClient(clientData)

        console.log('end client creation: ', client, adress, place)
        res.render('account/index', { loggedIn: true, client, adress, place })
    } catch (error) {
        console.log('Internal server error: ', error)
        res.render('account/index', { loggedIn: false })
    }
    
})

export default router