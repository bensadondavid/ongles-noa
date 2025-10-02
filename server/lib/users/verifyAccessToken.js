const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const verifyAccessToken = async(req, res)=>{
    try{
        const accessToken = req.headers['authorization'].split(' ')[1]
        if(!accessToken){
            return res.status(401).json({message : 'No access token found'})
        }
        const decoded = jwt.verify(accessToken, secret)
        return res.status(200).json({ ok: true, id: decoded.userId, name : decoded.userName, email : decoded.userEmail })
    }
    catch(error){
       if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token expired' })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid access token' })
        }
            console.error(error)
            return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = verifyAccessToken