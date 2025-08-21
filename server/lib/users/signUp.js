const pool = require('../db')
const bcrypt = require('bcryptjs')

const signUp = async(req, res)=>{
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const { name, lastname, email, phone, password} = req.body
    try{
        // Look for an existing user
        const user = await pool.query(
            `SELECT * FROM users WHERE
             LOWER(email) = LOWER($1)
             OR phone = $2`,
            [email, phone]
        )
         if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' })
        }
        if(user.rows.length !== 0){
            return res.status(409).json({message : 'Phone number or email already taken'})
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Creating a new user
         await pool.query(
            `INSERT INTO users (name, lastname, email, phone, password)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
            [name, lastname, email, phone, hashedPassword]
        )
        res.status(201).json({message : 'New user added'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : error})
    }
}

module.exports = signUp