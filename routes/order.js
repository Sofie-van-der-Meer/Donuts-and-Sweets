import express from 'express';
import { getAllPayMethods } from '../models/payMethod.js';
import Validate from '../middleware/validate.js';
import { check } from 'express-validator'
import { CreateOrder, CreateOrderLines, getOrders } from '../controllers/orders.js';

const router = express.Router();


router.get('/', async (req, res) => {
    let ordersData = null
    if (req.session.order) {
        ordersData = req.session.order
    }
    const cartData = req.session.cart
    const clientData = req.session.client
    const payMethodData = await getAllPayMethods()
    console.log('orders: ', ordersData)
    res.render('order/index', { clientData, cartData, payMethodData, ordersData })
})

router.post(
    '/checkout',
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
    check('clientId')        
        .isInt({ min: 0, max: 99999 }),
    check('deliverTime').not().isEmpty(),
    check('payMethodId').not().isEmpty(),
    check('deliverCost').not().isEmpty(),
    Validate,
    CreateOrder,
    CreateOrderLines,
    getOrders
)


export default router