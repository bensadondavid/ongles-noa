const pool = require('../db')
const bcrypt = require('bcryptjs')

const signUp = async(req, res)=>{
    const { name, email, phone, password} = req.body
    try{
        // Look for an existing user
        const user = await pool.query(
            `SELECT * FROM users_noa_ongles WHERE
             LOWER(email) = LOWER($1)
             OR phone = $2`,
            [email, phone]
        )
        if(user.rows.length !== 0){
            return res.status(409).json({message : 'Phone number or email already taken'})
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Creating a new user
         await pool.query(
            `INSERT INTO users_noa_ongles (name, email, phone, hashed_password)
            VALUES($1, $2, $3, $4) 
            RETURNING *`,
            [name, email, phone, hashedPassword]
        )
        res.status(201).json({message : 'New user added'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : error})
    }
}

module.exports = signUp