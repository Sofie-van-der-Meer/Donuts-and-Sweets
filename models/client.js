import connection from "../config/config.js";

export const createClient = (data) => {
    return new Promise((resolve, reject) => {
        console.log(data)
        const { firstName, lastName, adressId, phoneNr, accountId } = data;
        connection.query(
            'INSERT INTO clients (firstName, lastName, adressId, phoneNr, accountId) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, adressId, phoneNr, accountId],
            (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ id: results.insertId, ...data })
                }
            }
        )         
    })
}

export const getClientById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM clients WHERE clientId = ?',
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

export const getClientByAccountId = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM clients WHERE accountId = ?',
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