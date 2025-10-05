const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const pool = require('../db')
const crypto = require('crypto')


const logIn = async(req, res)=>{

    const secret = process.env.JWT_SECRET
    try{
        const {mailOrPhone, password} = req.body
        const result = await pool.query(
            `SELECT * FROM users_noa_ongles WHERE LOWER(email) = LOWER($1) or phone = $1`,
            [mailOrPhone]
        )
        if(result.rows.length === 0){
        return res.status(401).json({message : 'Unknown Email or Phone number'})
        }
        const user = result.rows[0]
        const verifyPassword = await bcrypt.compare(password, user.hashed_password)
        if(!verifyPassword){
            return res.status(401).json({message : 'Invalid credentials'})
        }
        const accessToken = jwt.sign({'userId' : String(user.id)}, secret, {expiresIn : '15m'})
        const refreshToken = crypto.randomBytes(64).toString('hex')
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        const userAgent = req.headers['user-agent'] || "unknown"
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token, expires_at, user_agent, ip_address)
             VALUES($1, $2, $3, $4, $5)`,
             [user.id, refreshToken, expiresAt, userAgent, ipAddress]
        )
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('refresh-token', refreshToken,{
            httpOnly: true,
            sameSite: isProd ? 'none' : 'lax', // cross-site en prod => 'none'
            secure: isProd,                    // obligatoire si SameSite=None
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/',
        }
        )
        const safeUser = {
            id: user.id,
            name: user.name,
            lastName : user.last_name,
            email: user.email,
            phone: user.phone,
        }
        console.log('connected')
        res.status(200).json({message : 'Authentication successful', user : safeUser, accessToken : accessToken})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : 'Internal Error'})
    }
}

module.exports = logIn