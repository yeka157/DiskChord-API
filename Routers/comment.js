const express = require('express');
const { commentController } = require('../Controllers');
const route = express.Router();


route.get('/all', commentController.getData); // ga dipake?
route.post('/add/:id', commentController.addComment); //done
route.get('/:id', commentController.getComment); //done
route.post('/more/:id', commentController.getMoreComment);
route.get('/all/:id', commentController.getAllComment);
module.exports = route;