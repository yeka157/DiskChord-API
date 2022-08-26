const express = require('express');
const { commentController } = require('../Controllers');
const route = express.Router();


route.post('/add/:id', commentController.addComment); 
route.get('/:id', commentController.getComment);
route.post('/more/:id', commentController.getMoreComment);
route.get('/all/:id', commentController.getAllComment);
module.exports = route;