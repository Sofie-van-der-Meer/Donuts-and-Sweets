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
    const link = {
        href: '',
        title: ''
    }

    if (req.session.cart) {
        cart = req.session.cart
        for (let productId in cart.products) {
            const product = await getProductById(productId)
            products.push({product, quantity: req.session.cart.products[productId]})
        }
    }
    if (req.session.client && req.session.client.client) {
        link.href = '/order'
        link.title = 'ORDER'
        }
    else {
        link.href = '/account'
        link.title = 'LOGIN TO ORDER'
    }
    console.log(products)
    res.render('cart/index', { products, cart: cart, link })
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