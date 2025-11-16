const express = require('express')
const router = express.Router()

const crenaux = require('../lib/bookings/crenaux')


router.post('/availability', crenaux)


module.exports = router