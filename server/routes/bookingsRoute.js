const express = require('express')
const router = express.Router()

const crenaux = require('../lib/bookings/crenaux')


router.post('/get-availability', crenaux)


module.exports = router