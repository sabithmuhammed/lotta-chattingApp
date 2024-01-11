require('dotenv').config();

const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const {database_connection,port} = process.env
mongoose.connect(database_connection+"lotta");

const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express)
app.use('/',userRoutes)


app.listen(port,()=>console.log(`server is running on port ${port}`))