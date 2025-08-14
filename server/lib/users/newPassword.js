const pool = require('../db')
const bcrypt = require('bcryptjs')


const newPassword = async(req, res)=>{

    try{
        const {token, password} = req.body
        if (!token || !password) {
            return res.status(400).json({ message: 'Missing fields' })
        }
        const result = await pool.query(
            `SELECT * FROM users WHERE reset_password_token = $1`, 
            [token]
        )
        if(result.rows.length === 0){
            return res.status(400).json({message : 'Invalid link'})
        }
        const user = result.rows[0]
        if(new Date() > new Date(user.reset_password_expiration)){
            return res.status(400).json({message : 'Expired link'})
        }
        const hashPassword = await bcrypt.hash(password, 10)
        await pool.query(
            `UPDATE users
            SET password = $1, reset_password_token = null, reset_password_expiration = null
            WHERE id = $2`,
            [hashPassword, user.id]
        )
        res.status(200).json({message : 'Password updated'})
    }
     catch(error){
            console.log(error);
            res.status(500).json({message : 'Internal Error'})
        }
}

module.exports = newPassword