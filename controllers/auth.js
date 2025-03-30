import bcrypt from 'bcryptjs';
import { getAccountByEmail, getEmailById } from '../models/account.js';
import { createPlace, getPlaceByData, getPlaceById } from '../models/place.js';
import { createAdress, getAdressById } from '../models/adress.js';
import { createClient, getClientByAccountId } from '../models/client.js';

export async function RegisterAccount(req, res) {
    try {
        const { email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const accountData = {
            email, 
            password: hashedPassword
        }

        const newAccount = await createAccount(accountData)
        req.session.client.account.id = newAccount.id

        res.render('account/register', {url: 'client'})
    } catch (error) {
        console.log('Internal server error: ', error)
        res.render('', { clientData: req.session.client })
    }
}

export async function Register(req, res) {

    const { firstName, lastName, phoneNr, street, houseNr, bus, zipCode, placeName } = req.body
    const accountId = req.session.client.account.id 

    try {
        if (!accountId && !0) {
            return res.status(400).send('Account not found. Please complete the first step of the registration', req.session.accountId)
        }
        const email = await getEmailById(accountId)

        const placeData = { zipCode, placeName }
        const existingPlace = await getPlaceByData(placeData)
        let place
        if (existingPlace) {
            place = existingPlace
        } else {
            place = await createPlace(placeData)
        }

        const placeId = place.placeId
        const adressData = { street, houseNr, bus, placeId}
        const adress = await createAdress(adressData)
        const clientData = { firstName, lastName, phoneNr, adressId: adress.id, accountId }
        const client = await createClient(clientData)
        const account = { loggedIn: true, email: email.email}

        req.session.client = { account, client, adress, place }
        res.redirect('/account')
    } catch (error) {
        console.log('Register: Internal server error: ', error)
        res.redirect('/account')
    }
    res.end()
}

export async function Login(req, res) {
    const { email } = req.body

    try {
        const user = await getAccountByEmail(email)
        if (!user) {
            return res.status(400).send('Invalid email or password. Please try again with the correct credentials.')
        }
        const isPasswordValid = await bcrypt.compare(`${req.body.password}`, user.password)
        if (!isPasswordValid) {
            return res.status(400).send('Invalid email or password. Please try again with the correct credentials.')
        }
        const account = {
            id: user.accountId,
            email: user.email
        }
        const client = await getClientByAccountId(account.id)
        const adress = await getAdressById(client.clientId)
        const place = await getPlaceById(adress.placeId)

        if (!account || !client || !adress || !place) {
            return res.status(400).send(`Didn't find your personal data.`)
        }
        req.session.client = { account, client, adress, place }
        res.redirect('/account')
    } catch (error) {
        console.log('Login: Internal server error: ', error)
        res.redirect('/account')
    }
}