const express = require('express');
const user_route = express()
const {profileUpload} = require('../middlewares/multerConfig')
const pages = require('../controllers/pages')

user_route.get('/',pages.initialRender);

user_route.post('/register',pages.registerUser)
user_route.post('/login',pages.userLogin)

module.exports = user_route