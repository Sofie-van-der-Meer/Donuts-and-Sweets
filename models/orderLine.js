import connection from "../config/config.js";

export const createOrderLine = ({ orderId, productId, amount, price }) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO orderlines (orderId, productId, amount, price) VALUES (?, ?, ?, ?)',
            [orderId, productId, amount, price],
            (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ id: results.insertId, orderId, productId, amount, price})
                }
            }
        )         
    })
}

export const getAllOrderLinesByOrderId = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT 
                *
            FROM 
                orderlines
            WHERE 
                orderId = ?`,
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