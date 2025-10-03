const pool = require('../db')


const logOut = async(req, res)=>{
    try{
        const {id} = req.body
        
        await pool.query(
            `DELETE from refresh_tokens WHERE user_id = $1`,
            [id]
        )
        res.status(200).json({message : 'Log out successfull'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : 'Internal Server Error'})
    }
}

module.exports = logOut