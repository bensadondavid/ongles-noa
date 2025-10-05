const express = require('express')
const router = express.Router()


const signUp = require('../lib/users/signUp')
const login = require('../lib/users/login')
const authMiddleware = require('../lib/users/authMiddleware.js')
const me = require('../lib/users/me.js')
const refreshToken = require('../lib/users/refreshToken')
const logOut = require('../lib/users/logOut')

router.post('/sign-up', signUp)
router.post('/login', login)
router.post('/refresh', refreshToken)
router.get('/me', authMiddleware, me)
router.post('/log-out', logOut)


module.exports = router