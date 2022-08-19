const express = require('express');
const { readToken } = require('../config/encrypt');
const { uploader } = require('../config/uploader');
const { authController } = require('../Controllers');
const route = express.Router();

const uploadFile = uploader('/imgProfile', 'IMGPRFL').array('images',1);

route.get('/all', authController.getData); // ga dipake ??
route.post('/register', authController.register); //done
route.post('/login', authController.login); //done
route.get('/keep', readToken, authController.keepLogin); //done
route.get('/verify', readToken, authController.verify); //done
route.post('/username', authController.getUsername); //check duplicate
route.post('/email', authController.getEmail); //check duplicate
route.patch('/update/:id', uploadFile, authController.updateProfile); // edit profile with img, done
route.patch('/edit/:id', authController.updateNoImg); // edit no img, done
route.post('/send', authController.sendVerify); // send verification email, done
route.post('/reset', readToken, authController.resetPassword); // update password
route.post('/sendEmail', authController.sendReset);

module.exports = route;