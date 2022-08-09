const express = require('express');
const { commentController } = require('../Controllers');
const route = express.Router();


route.get('/all', commentController.getData);
route.post('/add', commentController.addComment);

module.exports = route;