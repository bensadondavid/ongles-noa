const pool = require('../db')


const crenaux = async (req, res)=>{
    try{
        const {date, prestations, options} = req.body
        console.log(date, prestations, options)

        // Recreate the date
        const [year, month, day] = date.split('-').map(Number);

        const newDate = new Date(Date.UTC(year, month - 1, day));
        
        const newDay = newDate.getUTCDay()

        // Check if day off
        const daysInfos = await pool.query(
            `SELECT is_closed, day_start, day_end FROM noa_ongles_opening_hours WHERE day_week = $1`, 
            [newDay]
        )
        const isClosed = daysInfos.rows[0].is_closed
        console.log(isClosed);
        if(isClosed){
            return res.status(400).json({message : 'day off'})
        }
        
        // Retrieving the day start and day end 

        const start = daysInfos.rows[0].day_start
        const end = daysInfos.rows[0].day_end
        const startMinutes = Number(start.slice(0, 2)) * 60 + Number(start.slice(3, 5))
        const endMinutes = Number(end.slice(0, 2)) * 60 + Number(end.slice(3, 5))
        console.log(start, end, startMinutes, endMinutes)

        // Calculate the prestation time
        const prestaRows = await pool.query(
            `SELECT * FROM noa_ongles_services WHERE slug = ANY($1) AND type = 'main'`,
            [prestations]
        )
        const optionRows = options && options.length > 0 ? await pool.query(
            `SELECT * FROM noa_ongles_services WHERE slug = ANY($1) AND type = 'option'`,
            [options]
        ) : {rows : []}

        const prestas = prestaRows.rows
        const opt = optionRows.rows

        const totalDurationPresta = prestas.reduce((acc, presta)=>{
            return acc + presta.duration_minutes
        }, 0)
        const totalDurationOptions = opt.reduce((acc, option)=>{
            return acc + option.duration_minutes
        }, 0)
        const totalDuration = totalDurationPresta + totalDurationOptions
        console.log(totalDuration)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message : 'Internal Server Error'})
    }
}


module.exports = crenaux