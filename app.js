require('dotenv').config();
const path = require('path')
const mongoose = require('mongoose')
const morgan =require('morgan');
const userRoutes = require('./routes/userRoutes')
const {database_connection,port} = process.env
mongoose.connect(database_connection+"lotta");

const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('tiny'))
app.set('view engine','ejs')
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/images", express.static(path.resolve(__dirname, "assets/images")));
app.use('/',userRoutes)


app.listen(port,()=>console.log(`server is running on port ${port}`))