const express = require('express');
const { readToken } = require('../config/encrypt');
const { uploader } = require('../config/uploader');
const { authController } = require('../Controllers');
const route = express.Router();

const uploadFile = uploader('/imgProfile', 'IMGPRFL').array('images',1);

route.post('/register', authController.register);
route.post('/login', authController.login);
route.get('/keep', readToken, authController.keepLogin);
route.get('/verify', readToken, authController.verify);
route.post('/username', authController.getUsername);
route.post('/email', authController.getEmail); 
route.patch('/update/:id', uploadFile, authController.updateProfile);
route.patch('/edit/:id', authController.updateNoImg);
route.post('/send', authController.sendVerify);
route.post('/reset', readToken, authController.resetPassword);
route.post('/sendEmail', authController.sendReset);

module.exports = route;