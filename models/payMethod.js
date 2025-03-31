import connection from "../config/config.js";

export const getPayMethodsById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM betaalmiddelen WHERE payMethodId = ?',
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

export const getAllPayMethods = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT 
                *
            FROM 
                betaalmiddelen`,
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