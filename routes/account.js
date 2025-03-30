import express from 'express';
import { check } from 'express-validator'
import { getAccountByEmail } from '../models/account.js';
import Validate from '../middleware/validate.js';
import { Login, Register, RegisterAccount } from '../controllers/auth.js';

const router = express.Router();

// const verifyToken = (req, res, next) => {
//     const token = req.headers['authorization']
//     if (!token) {
//         return res.status(401).json({ error: 'unauthorized'})
//     }
//     jwt.verify(token, 'secret', (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ error: 'unauthorized'})
//         }
//         req.user = decoded
//         next()
//     })
// }

router.get('/', (req, res) => {
    let clientData = null
    if (req.session.client) {
        clientData = req.session.client 
    }
    res.render('account/index', { clientData })
})

router.get('/register', (req, res) => {
    res.render('account/register', {url: 'account'})
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    let clientData = null
    res.render('account/index', { clientData })
})

router.post(
    '/login',
    check('email')
        .isEmail()
        .withMessage('Enter a valid email adress')
        .normalizeEmail(),
    check('password').not().isEmpty(),
    Validate,
    Login
)

router.post('/register/createAccount', 
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
    Validate,
    RegisterAccount
)

router.post(
    '/register/client', 
    check('firstName')
        .isLength({ min: 3, max: 50 })
        .withMessage('First name must be between 3 and 50 characters')
        .trim()
        .escape(),
    check('lastName')
        .isLength({ min: 3, max: 50 })
        .withMessage('Lastname must be between 3 and 50 characters')
        .trim()
        .escape(),
    check('phoneNr')
        .matches(/^[0-9]{8,9}$/)
        .withMessage('Phone number must be 8-9 digits long'),
    check('street')
        .isLength({ min: 3, max: 50 })
        .withMessage('Street must be between 3 and 50 characters.')
        .matches(/^[a-zA-Z0-9\s,.'-]+$/)
        .withMessage('Street can only contain letters, digits, spaces, commas, periods, apostrophes, and hyphens.'),
    check('houseNr')
        .isInt({ min: 1, max: 99999 })
        .withMessage('House number must be a positive integer between 1 and 99999.'),
    check('bus')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage('Bus can only contain letters and numbers.'),
    check('zipCode')
        .isLength({ min: 4, max: 4 })
        .withMessage('Zip code must be exactly 4 digits.')
        .isInt()
        .withMessage('Zip code must be numeric.')
        .matches(/^\d{4}$/)
        .withMessage('Zip code must contain exactly 4 digits.'),
    check('placeName')
        .isLength({ min: 3, max: 50 })
        .withMessage('City name must be between 3 and 50 characters.')
        .matches(/^[a-zA-Z\-]+$/)
        .withMessage('City name can only contain letters and hyphens.'), 
    Validate,
    Register
)

export default router