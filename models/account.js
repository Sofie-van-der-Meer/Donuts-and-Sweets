import connection from "../config/config.js";

export const createAccount = (data) => {
    return new Promise((resolve, reject) => {
        console.log(data)
        const { email, password } = data;
        connection.query(
            'INSERT INTO accounts (email, password) VALUES (?, ?)',
            [email, password],
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

export const getAccountByEmail = (email) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM accounts WHERE email = ?',
            [email],
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

export const getEmailById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM accounts WHERE accountId = ?',
            [id],
            (err, results) => {
                if (err) {
                    reject(err)
                } 
                else {
                    resolve({ email: results.email })
                }
            }
        )         
    })
}