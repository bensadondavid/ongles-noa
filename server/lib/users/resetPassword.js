const pool = require('../db')
const sendMail = require('./sendEmail')
const crypto = require('crypto')


const resetPassword = async(req, res)=>{
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    try{
        const {mailOrPhone} = req.body
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1 or phone = $1`, 
            [mailOrPhone]
        )
        if(result.rows.length === 0){
            return res.status(500).json({message : 'No user found with this E-mail or Phone number'})
        }
        const user = result.rows[0]
        const resetPasswordToken = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60)
        await pool.query(
            `UPDATE users
            SET reset_password_token = $1, reset_password_expiration = $2 WHERE id = $3`,
            [resetPasswordToken, expiresAt, user.id]
        )
        const resetLink = `${baseUrl}/reset-password?token=${resetPasswordToken}`
        await sendMail(
            user.email,
            'RESET YOUR PASSWORD',
            `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif;">
                <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="padding: 20px;">
                        <h1 style="font-size: 24px; margin-bottom: 16px;">Hello ${user.name}</h1>
                        <p style="font-size: 16px; margin-bottom: 24px;">
                            Please click on the link below to reset your password:
                        </p>
                        <a href="${resetLink}" style="font-size: 16px; color: #1a73e8; text-decoration: none;">
                            ${resetLink}
                        </a>
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
            `
        )
        res.status(200).json({ message: 'Reset link sent to your email' })
    }
    catch(error){
        console.log(error)
        res.status(500).json({message : 'Internal server error'})
    }
}

module.exports = resetPassword