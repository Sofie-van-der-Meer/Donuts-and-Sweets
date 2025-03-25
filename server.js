import express from 'express';
import 'dotenv/config'
import methodOverride from 'method-override'
import productRouter from './routes/products.js'
import { getAllProducts, getAllProductsByCategoryId } from './models/product.js';
import { getAllCategories } from './models/category.js';

const app = express()

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

// app.get('/', async (req, res) => {
//     const products = await getAllProducts()
//     res.render('products/index', { products: products })
// })
app.get('/', async (req, res) => {
    const products = await getAllProducts()
    const categories = await getAllCategories()
    console.log(products)
    // const productGroup = []

    // for (let i = 0; i < categories.length; i++) {
    //     productGroup[i] = await getAllProductsByCategoryId(i)
    // }
    // console.log(productGroup)
    res.render('index', { categories, products })
})

app.use('/products', productRouter)

app.listen(process.env.DB_PORT) 