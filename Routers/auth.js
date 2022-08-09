const express = require('express');
const { readToken } = require('../config/encrypt');
const { authController } = require('../Controllers');
const route = express.Router();

route.get('/all', authController.getData); // ga dipake
route.post('/register', authController.register); //done
route.post('/login', authController.login); //done
route.get('/keep', readToken, authController.keepLogin); //done
route.get('/verify', readToken, authController.verify); //kurang FE verification
route.post('/username', authController.getUsername); //check duplicate
route.post('/email', authController.getEmail); //check duplicate
route.post('/forgot', authController.forgotPassword);

module.exports = route;