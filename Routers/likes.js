const express = require('express');
const { likeController } = require('../Controllers');
const route = express.Router();

route.get('/all', likeController.getLike); //ga kepake
route.post('/add', likeController.addLike); //done
route.delete('/unlike', likeController.unLike); //ga kepake
module.exports = route;