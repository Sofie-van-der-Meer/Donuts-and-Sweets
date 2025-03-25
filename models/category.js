import connection from "../config/config.js";
    
export const getCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM categorieen WHERE categoryId = ?',
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

export const getAllCategories = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM categorieen',
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