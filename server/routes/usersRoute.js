const express = require('express')
const router = express.Router()


const signUp = require('../lib/users/signUp')
const login = require('../lib/users/login')
const verifyAccessToken = require('../lib/users/verifyAccessToken')
const refreshToken = require('../lib/users/refreshToken')
const logOut = require('../lib/users/logOut')

router.post('/sign-up', signUp)
router.post('/login', login)
router.get('/verify', verifyAccessToken)
router.post('/refresh', refreshToken)
router.post('/log-out', logOut)


module.exports = router