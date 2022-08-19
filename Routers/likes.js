const express = require('express');
const { likeController } = require('../Controllers');
const route = express.Router();

route.get('/all', likeController.getLike);
route.post('/add', likeController.addLike);
route.delete('/unlike', likeController.unLike);
module.exports = route;