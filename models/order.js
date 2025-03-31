import connection from "../config/config.js";

export const createOrder = ({ clientId, deliverTime, deliverCost, payMethodId, deliverAdressId }) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `INSERT INTO orders
            (clientId, deliverTime, deliverCost, payMethodId, deliverAdressId) 
            VALUES (?, ?, ?, ?, ?)`,
            [clientId, deliverTime, deliverCost, payMethodId, deliverAdressId],
            (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ id: results.insertId, ...results})
                }
            }
        )         
    })
}

export const getAllOrdersByClientId = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT 
                *
            FROM 
                orders
            WHERE 
                clientId = ?`,
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