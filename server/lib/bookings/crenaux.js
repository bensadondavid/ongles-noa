const pool = require('../db')


const crenaux = async (req, res)=>{
    try{
        const {date, prestations, options} = req.body
        console.log(date, prestations, options)

        const prestaRows = await pool.query(
            `SELECT * FROM noa_ongles_services WHERE slug = ANY($1) AND type = 'main'`,
            [prestations]
        )
        const optionRows = await pool.query(
            `SELECT * FROM noa_ongles_services WHERE slug = ANY($1) AND type = 'option'`,
            [options]
        )

        const prestas = prestaRows.rows
        const opt = optionRows.rows

        const totalDurationPresta = prestas.reduce((acc, presta)=>{
            return acc + presta.duration_minutes
        }, 0)
        const totalDurationOptions = opt.reduce((acc, option)=>{
            return acc + option.duration_minutes
        }, 0)
        const totalDuration = totalDurationPresta + totalDurationOptions
        console.log(totalDurationPresta)
        console.log(totalDurationOptions)
        console.log(totalDuration)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message : 'Internal Server Error'})
    }
}


module.exports = crenaux