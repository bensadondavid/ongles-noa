const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const authMiddleware = async(req, res, next)=>{
    try{
        const accessToken = req.headers['authorization'].split(' ')[1]
        if(!accessToken){
            return res.status(401).json({message : 'No access token found'})
        }
        const decoded = jwt.sign(accessToken, secret)
        req.id = decoded.userId
        next()
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : 'Internal server error'})
    }
}

module.exports = authMiddleware