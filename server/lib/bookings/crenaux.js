const pool = require('../db')


const crenaux = async (req, res)=>{
    try{
        const {date, prestations, options} = req.body
        console.log(date, prestations, options)

        const [year, month, day] = date.split('-').map(Number);

        const newDate = new Date(Date.UTC(year, month - 1, day));
        console.log(newDate);
        
        const newDay = newDate.getUTCDay()

        const isClosed = await pool.query(
            `SELECT is_closed FROM noa_ongles_opening_hours WHERE day_week = $1`, 
            [newDay]
        )

        const daysClosed = isClosed.rows
        console.log(daysClosed);
        

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