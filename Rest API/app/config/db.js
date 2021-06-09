// const mysql = require("mysql")

// const conn = mysql.createPool({
//     user: 'root',
//     password: 'capx335-rice-disease',
//     database: 'rice_diseases',
//     // socketPath: `${process.env.DB_SOCKET_PATH}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
//     host: '34.101.71.31',
//     multipleStatements: true
// })

// module.exports = conn

const mysql = require("mysql")

const conn = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: `${process.env.DB_SOCKET_PATH}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    multipleStatements: true
})

conn.connect(err => {
    if (err) throw err
})

module.exports = conn