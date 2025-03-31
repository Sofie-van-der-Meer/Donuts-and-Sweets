import connection from "../config/config.js";

export const createAdress = (data) => {
    return new Promise((resolve, reject) => {
        console.log(data)
        const { street, houseNr, bus, placeId } = data;
        connection.query(
            'INSERT INTO adresses (street, houseNr, bus, placeId) VALUES (?, ?, ?, ?)',
            [street, houseNr, bus, placeId],
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

export const getAdressById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM adresses WHERE adressId = ?',
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


export const getAdressByData= ({street, houseNr, bus, placeId,}) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM adresses WHERE street = ? AND houseNr = ? AND bus = ? AND placeId = ?',
            [street, houseNr, bus, placeId],
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