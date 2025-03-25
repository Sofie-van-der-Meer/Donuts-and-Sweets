import mysql from 'mysql2';
import 'dotenv/config'

const connection = mysql.createConnection({
    host:       process.env.DB_HOST,
    user:       process.env.DB_USERNAME,
    password:   process.env.DB_PASSWORD,
    database:   process.env.DB_NAME
})

connection.connect((err) => {
    if (err) {
        console.error('error connection to MySql:', err.stack)
    }
    console.log('connected to MySql')
})

export default connection