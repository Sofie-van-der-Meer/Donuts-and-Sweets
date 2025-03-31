import { createAdress, getAdressByData } from "../models/adress.js"
import { createOrder, getAllOrdersByClientId } from "../models/order.js"
import { createOrderLine, getAllOrderLinesByOrderId } from "../models/orderLine.js"
import { createPlace, getPlaceByData } from "../models/place.js"
import { getPriceById } from "../models/product.js"

export async function CreateOrder(req, res, next) {
    console.log('/order/checkout => req.body: ', req.body)
    const { street, houseNr, bus, zipCode, placeName, 
        clientId, deliverTime, payMethodId, deliverCost } = req.body
    
    try {
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
        const existingAdress = await getAdressByData(adressData)
        let adress
        if (existingAdress) {
            adress = existingAdress
        } else {
            adress = await createAdress(adressData)
        }
        const deliverAdressId = adress.adressId

        let milliseconds = Date.now()
        
        switch (deliverTime) {
            case '0000':
                milliseconds = milliseconds +3000000
                break;
            case '3600':
                milliseconds = milliseconds +3600000
                break;
            case '4500':
                milliseconds = milliseconds +4500000
                break;
            case '5400':
                milliseconds = milliseconds +5400000
                break;
        
            default:
                break;
        }
        
        const time = new Date(milliseconds)
        if (!clientId || !time || !deliverCost || !payMethodId || !deliverAdressId) {
            console.log('clientId: ', clientId, 'time: ', time, 'deliverCost: ', deliverCost, 'payMethodId: ', payMethodId, 'deliverAdressId: ', deliverAdressId,)
            return res.status(400).send('Not all data is send')
        }
        const order = await createOrder({ clientId, deliverTime: time, deliverCost, payMethodId, deliverAdressId})
        console.log(order.id)
        req.orderId = order.id

        next()

    } catch (error) {
        console.log('Register: Internal server error: ', error)
        res.redirect('/order')
    }
}

export async function CreateOrderLines(req, res, next) {
    const orderId = req.orderId
    const products = req.session.cart.products
    console.log('products: ', products)
    try {
        for (const key in products) {
            const orderId = req.orderId
            const productId = key
            const amount = products[key]
            const price = await getPriceById(productId)

            console.log(orderId, productId, amount, price)
            await createOrderLine({orderId, productId, amount, price: price.price})
        }
        next()
    } catch (error) {
        console.log('Register: Internal server error: ', error)
        res.redirect('/order')
    }   
}

export async function getOrders(req, res) {
    const clientId = req.body.clientId
    try {
        const ordersData = await getAllOrdersByClientId(clientId)
        await Promise.all(ordersData.map(async order => {
            const orderLinesData = await getAllOrderLinesByOrderId(order.orderId)
            order.orderLines = orderLinesData            
        }))

        console.log('ordersData: ', ordersData)
        res.redirect('/order')   
    } catch (error) {
        console.log('Register: Internal server error: ', error)
        res.redirect('/order')
    }
    res.end()
}