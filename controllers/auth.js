import { getEmailById } from '../models/account.js';
import { createPlace, getPlaceByData } from '../models/place.js';
import { createAdress } from '../models/adress.js';
import { createClient } from '../models/client.js';

export async function Register(req, res) {

    const { firstName, lastName, phoneNr, street, houseNr, bus, zipCode, placeName } = req.body
    const accountId = req.session.accountId

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
            console.log('existingPlace: ', existingPlace)
        } else {
            place = await createPlace(placeData)
        }

        console.log('place: ', place)
        const placeId = place.placeId
        const adressData = { street, houseNr, bus, placeId}
        const adress = await createAdress(adressData)
        const clientData = { firstName, lastName, phoneNr, adressId: adress.id, accountId }
        const client = await createClient(clientData)
        const account = { loggedIn: true, email}

        console.log('end client creation: ', account, client, adress, place)
        req.session.client = { account, client, adress, place }
        res.redirect('/account')
    } catch (error) {
        console.log('Internal server error: ', error)
        res.redirect('/account')
    }
    res.end()
}