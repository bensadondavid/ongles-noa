const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

const authMiddleware = (req, res, next)=>{
    try{
        const token = req.headers['authorization'].split(' ')[1]
        if(!token){
            return res.status(401).json({message : 'No token found'})
        }
        const verify = jwt.verify(token, secret)

        req.userId = verify.userId
        next()
    }
    catch(error){
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token expired' })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid access token' })
        }
        res.status(500).json({message : 'Internal server error'})
    }
}

module.exports = authMiddleware