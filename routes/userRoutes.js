const express = require('express');
const user_route = express()
const auth =require('../middlewares/authentication')
const {profileUpload} = require('../middlewares/multerConfig')
const pages = require('../controllers/pages')

user_route.get('/',pages.initialRender);

user_route.post('/register',pages.registerUser)
user_route.post('/login',pages.userLogin)

user_route.post('/searchUsers',pages.searchUsers)
user_route.get('/load-message/:receiverId',pages.loadMessage)
user_route.post('/send-message',pages.sendMessage)


module.exports = user_route