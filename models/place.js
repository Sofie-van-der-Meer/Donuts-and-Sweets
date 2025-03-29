import connection from "../config/config.js";

export const createPlace = ({ zipCode, placeName }) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'INSERT INTO plaatsen (zipCode, placeName) VALUES (?, ?)',
            [zipCode, placeName],
            (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ id: results.insertId, zipCode, placeName })
                }
            }
        )         
    })
}

export const getPlaceById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM plaatsen WHERE placeId = ?',
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

export const getPlaceByData= ({zipCode, placeName}) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM plaatsen WHERE zipCode = ? AND placeName = ?',
            [zipCode, placeName],
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

export const getAllPlaces = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT 
                placeId,
                zipCode,
                placeName
            FROM 
                producten`,
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