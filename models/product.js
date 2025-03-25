import connection from "../config/config.js";

export const createProduct = (productData) => {
    return new Promise((resolve, reject) => {
        console.log(productData)
        const { name, description, price, stock, imageUrl, categoryId } = productData;
        connection.query(
            'INSERT INTO producten (name, description, price, stock, imageUrl, categoryId) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock, imageUrl, categoryId],
            (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ id: results.insertId, ...productData })
                }
            }
        )         
    })
}

export const updateProduct = (productData) => {
    return new Promise((resolve, reject) => {
        console.log(productData)
        const { productId, name, description, price, stock, categoryId } = productData;
        connection.query(
            'UPDATE producten SET name = ?, description = ?, price = ?, stock = ?, categoryId = ? WHERE productId = ?',
            [name, description, price, stock, categoryId, productId],
            (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ id: results.insertId, ...productData })
                }
            }
        )         
    })
}
    
export const getProductById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM producten WHERE productId = ?',
            [id],
            (err, results) => {
                if (err) {
                    reject(err)
                } else if (results.length > 0) {
                    resolve(results[0])
                }
                else {
                    resolve(null)
                }
            }
        )         
    })
}

export const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT 
                producten.productId, 
                producten.name, 
                producten.description, 
                producten.price, 
                producten.stock, 
                producten.imageUrl, 
                producten.categoryId, 
                categorieen.name as categoryName
            FROM 
                producten
            INNER JOIN 
                categorieen 
            ON 
                producten.categoryId = categorieen.categoryId`,
            (err, results) => {
                if (err) {
                    reject(err)
                } else if (results.length > 0) {
                    resolve(results)
                }
                else {
                    resolve(null)
                }
            }
        )         
    })
}

export const getAllProductsByCategoryId = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT 
                producten.productId, 
                producten.name, 
                producten.description, 
                producten.price, 
                producten.stock, 
                producten.imageUrl, 
                producten.categoryId, 
                categorieen.name as categoryName
            FROM 
                producten
            INNER JOIN 
                categorieen 
            ON 
                producten.categoryId = categorieen.categoryId
            WHERE 
                categorieen.categoryId = ?`,
            [id],
            (err, results) => {
                if (err) {
                    reject(err)
                } else if (results.length > 0) {
                    resolve(results)
                }
                else {
                    resolve(null)
                }
            }
        )         
    })
}