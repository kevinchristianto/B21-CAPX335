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
    user: process.env.DB_USER || 'sql6430780',
    password: process.env.DB_PASS || 'alQ37w2i9f',
    database: process.env.DB_NAME || 'sql6430780',
    // socketPath: `${process.env.DB_SOCKET_PATH}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    host: process.env.DB_HOST || 'sql6.freemysqlhosting.net',
    multipleStatements: true
})

conn.connect(err => {
    if (err) throw err
})

module.exports = conn