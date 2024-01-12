const express = require('express');
const user_route = express()
const {profileUpload} = require('../middlewares/multerConfig')
const pages = require('../controllers/pages')

user_route.get('/',pages.initialRender)

module.exports = user_route