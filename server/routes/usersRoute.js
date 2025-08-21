const express = require('express')
const router = express.Router()


const signUp = require('../lib/users/signUp')

router.post('/sign-up', signUp)


module.exports = router