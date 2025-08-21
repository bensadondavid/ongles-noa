const express = require('express');
const app = express()
const userRoutes = require('../routes/usersRoute');

app.use('/users', userRoutes)

module.exports = app