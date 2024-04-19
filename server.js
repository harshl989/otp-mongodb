const express = require('express')

const app = express()

const cookieParser = require('cookie-parser');
app.use(cookieParser());

require('dotenv').config()
const PORT = process.env.PORT || 4000


app.use(express.json())


//calling Database function
require('./config/database').connect()

//route importing and mounting
const user = require('./routes/userRoutes')
const auth = require('./routes/authRoutes')
const otp = require('./routes/otpRoutes')

app.use('/api/v1', user)
app.use('/api/v1', auth)
app.use('/api/v1', otp)


app.listen(PORT, ()=>{
    console.log("Server Started")
   
})