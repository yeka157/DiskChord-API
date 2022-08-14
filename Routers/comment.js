const express = require('express');
const { commentController } = require('../Controllers');
const route = express.Router();


route.get('/all', commentController.getData);
route.post('/add/:id', commentController.addComment);
route.get('/:id', commentController.getComment);
module.exports = route;