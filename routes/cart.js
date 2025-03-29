import express from 'express';
import { getProductById } from '../models/product.js';
import { updateSessionCart, incrementCart, decrementCart } from './_functions.js';

const router = express.Router();

let cart = {
    amount: 0,
    total: 0,
    products: {}
}

router.get('/', async (req, res) => {

    const products = []

    if (req.session.cart) {
        cart = req.session.cart
        for (let productId in cart.products) {
            const product = await getProductById(productId)
            products.push({product, quantity: req.session.cart.products[productId]})
        }
    }
    console.log(products)
    res.render('cart/index', { products, cart: cart })
})

router.get('/:id/add', (req, res) => {
    const redirectUrl = '/cart'
    updateSessionCart(req, res, incrementCart, redirectUrl)
})
router.get('/:id/reduce', (req, res) => {
    const redirectUrl = '/cart'
    updateSessionCart(req, res, decrementCart, redirectUrl)
})

export default router