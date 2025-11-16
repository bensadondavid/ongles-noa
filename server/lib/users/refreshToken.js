const pool = require('../db')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const refreshAccessToken = async(req, res)=>{
    try{
        const refreshToken = req.cookies['refresh-token']
        if(!refreshToken){
            return res.status(401).json({message : 'No refresh token found'})
        }
        const result = await pool.query(
            `SELECT * FROM noa_ongles_refresh_tokens WHERE token = $1`, 
            [refreshToken]
        )
        if(result.rows.length === 0){
            return res.status(401).json({message : 'Invalid token'})
        }
        const verifyToken = result.rows[0]
        if(new Date(verifyToken.expires_at) < new Date()){
            return res.status(401).json({message : 'Expired token'})
        }
         const userResult = await pool.query(
            `SELECT * FROM noa_ongles_users WHERE id = $1`,
            [verifyToken.user_id]
        )
        const user = userResult.rows[0]
        const accessToken = jwt.sign({'userId' : String(user.id)}, secret, {expiresIn : '15m'})
        const safeUser = {
            id: user.id,
            name: user.name,
            lastName : user.last_name,
            email: user.email,
            phone: user.phone,
        }
        res.status(200).json({message : 'Access token created', accessToken : accessToken, user : safeUser})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : 'Internal server error'})
    }
}

module.exports = refreshAccessToken