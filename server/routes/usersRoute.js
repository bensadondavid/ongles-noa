const express = require('express')
const router = express.Router()


const signUp = require('../lib/users/signUp')
const login = require('../lib/users/login')
const verifyAccessToken = require('../lib/users/verifyAccessToken')
const refreshToken = require('../lib/users/refreshToken')

router.post('/sign-up', signUp)
router.post('/login', login)
router.get('/verify', verifyAccessToken)
router.post('/refresh', refreshToken)


module.exports = router