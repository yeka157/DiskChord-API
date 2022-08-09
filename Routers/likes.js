const express = require('express');
const { likeController } = require('../Controllers');
const route = express.Router();

route.get('/all', likeController.getLike);
route.post('/add', likeController.addLike);
route.post('/unlike', likeController.unLike);
route.post('/new', likeController.newLike);
module.exports = route;