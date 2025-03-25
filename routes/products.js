import express from 'express';
import { createProduct, getProductById, updateProduct } from '../models/product.js';
import { getAllCategories, getCategoryById } from '../models/category.js';
import { upload } from '../models/image.js';

const router = express.Router();

let product = {
    name: '',
    description: '',
    price: '',
    stock: '', 
    imageUrl: '', 
    categoryId: ''
}
let categories = {}

router.get('/new', async (req, res) => {
    categories = await getAllCategories()
    res.render('products/new', { product: product, categories: categories })
})

router.get('/edit/:id', async (req, res) => {
    try {
        product = await getProductById(req.params.id)
        categories = await getAllCategories()
        res.render('products/edit', { product: product, categories: categories })
    } catch (e) {
        res.redirect('/'); 
        console.log('router.get /edit/:id: ', e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        product = await getProductById(req.params.id)
        const category = await getCategoryById(product.categoryId)
        res.render('products/show', { product: product, category: category })
    }
    catch (e) {
        res.redirect('/'); 
        console.log('router.get /edit/:id: ', e)
    }
})

router.put('/:id', async (req, res) => {
    const { productId, name, description, price, stock, categoryId } = req.body

    product = {
        productId, 
        name, 
        description, 
        price, 
        stock, 
        categoryId
    }
    try {
        product = await updateProduct(product)
        res.redirect(`/products/${product.productId}`)
        console.log('update product')
    } catch (e) {
        res.render('products/edit', { product: product, categories: categories })
        console.error('update product failed: ' + e)
    }
})

router.post('/', upload.single('imageUrl') , async (req, res) => {
    const productId = req.body.id
    const imageUrl = req.file ? `/images/${req.file.filename}` : ''
    const { name, description, price, stock, categoryId } = req.body

    product = {
        productId, 
        name, 
        description, 
        price, 
        stock, 
        imageUrl,
        categoryId,
    }
    try {
        product = await createProduct(product)
        res.redirect(`/products/${product.id}`)
        console.log('create product')
    } catch (e) {
        res.render('products/new', { product: product, categories: categories })
        console.error('create product failed: ' + e)
    }
})

export default router