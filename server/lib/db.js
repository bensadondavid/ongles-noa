const { Pool } = require('pg')
const dotenv = require('dotenv').config()

const pool = new Pool({
    connectionString : process.env.DATA_URL,
    ssl : {
        rejectUnauthorized : false
    }
})

module.exports = pool