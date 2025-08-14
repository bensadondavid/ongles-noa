const pool = require('../db')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendMail = require('./sendEmail')

const signIn = async(req, res)=>{
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
        const emailToken = crypto.randomBytes(32).toString('hex')
        // Creating a new user
        const result = await pool.query(
            `INSERT INTO users (name, lastname, email, email_verification_token, phone, password)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`,
            [name, lastname, email, emailToken, phone, hashedPassword]
        )
        // Sending a confirmation email
        const verificationLink = `${baseUrl}/verify-email?token=${emailToken}`
        await sendMail(
        email,
        'VERIFICATION OF YOUR EMAIL ADDRESS',
        `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif;">
            <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="padding: 20px;">
                    <h1 style="font-size: 24px; margin-bottom: 16px;">Hello ${name}</h1>
                    <p style="font-size: 16px; margin-bottom: 24px;">
                        Please click on the link below to verify your email address:
                    </p>
                    <a href="${verificationLink}" style="font-size: 16px; color: #1a73e8; text-decoration: none;">
                        ${verificationLink}
                    </a>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        `
        )
        res.status(201).json({message : 'New user added'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : error})
    }
}

module.exports = signIn