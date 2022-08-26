const express = require('express');
const { likeController } = require('../Controllers');
const route = express.Router();

route.post('/add', likeController.addLike);
module.exports = route;