const express = require('express');
const app = express()
const userRoutes = require('../routes/usersRoute');
const bookingsRoute = require('../routes/bookingsRoute');
const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(cors({
  origin: process.env.URL_FRONT || 'http://localhost:5173',        
  credentials: true,             
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json())
app.use(cookieParser())

app.use('/users', userRoutes)
app.use('/bookings', bookingsRoute)

module.exports = app