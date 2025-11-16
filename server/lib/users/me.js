const pool = require('../db')


const me = async(req, res)=>{
    try{
        const userId = req.userId
         if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const infos = await pool.query(
            `SELECT id, name, last_name AS "lastName", phone, email FROM noa_ongles_users WHERE id = $1`,
            [userId]
        )
        if(infos.rows.length === 0){
            return res.status(404).json({message : 'No user found'})
        }
        const user = infos.rows[0]
        res.status(200).json({user})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message : 'Internal Server Error'})
    }
}

module.exports = me