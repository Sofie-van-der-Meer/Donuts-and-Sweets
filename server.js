import express from 'express';
import 'dotenv/config'
import methodOverride from 'method-override'
import session from 'express-session'
import { getAllProducts, getAllProductsByCategoryId } from './models/product.js';
import { getAllCategories } from './models/category.js';

const app = express()

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

let cart = {
    amount: 0,
    total: 0,
    products: {}
}

app.get('/', async (req, res) => {
    const products = await getAllProducts()
    const categories = await getAllCategories()
    if (req.session.cart) {
        cart = req.session.cart
    }
    res.render('index', { categories, products, cart })
})

// set up routes
import productRouter from './routes/products.js'
import cartRouter from './routes/cart.js'
import accountRouter from './routes/account.js'

app.use('/products', productRouter)
app.use('/cart', cartRouter)
app.use('/account', accountRouter)

// start server
app.listen(process.env.DB_PORT) 