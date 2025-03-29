import { getPriceById } from "../models/product.js"

export async function updateSessionCart(req, res, func, url) {
    const productId = req.params.id
    const productPrice = await getPriceById(productId)

    if (!req.session.cart) {
        req.session.cart = {
            amount: 0,
            total: 0,
            products: {}
        }
    }
    func(req.session, productId, productPrice.price)

    console.log('update cart: ', req.session.cart)
    res.redirect(url);
}

export function decrementCart(session, productId, productPrice) {
    if (session.cart.products[productId] && session.cart.products[productId] > 1) {
        session.cart.products[productId] -= 1
    } else {
        session.cart.products[productId] = 0
    }
    if (session.cart.total && session.cart.total > productPrice) {
        session.cart.total = Math.round((session.cart.total - productPrice) * 100) / 100
    } else {
        session.cart.total = 0
    }
    if (session.cart.amount && session.cart.amount > 1) {
        session.cart.amount -= 1
    } else {
        session.cart.amount = 0
    }
}

export function incrementCart(session, productId, productPrice) {
    if (session.cart.products[productId]) {
        session.cart.products[productId] += 1
    } else {
        session.cart.products[productId] = 1
    }
    if (session.cart.total) {
        session.cart.total = Math.round((session.cart.total + productPrice) * 100) / 100
    } else {
        session.cart.total = Math.round((productPrice) * 100) / 100
    }
    if (session.cart.amount) {
        session.cart.amount += 1
    } else {
        session.cart.amount = 1
    }
}