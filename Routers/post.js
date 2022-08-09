const express = require('express');
const { readToken } = require('../config/encrypt');
const { uploader } = require('../config/uploader');
const { postController } = require('../Controllers');
const route = express.Router();

const uploadFile = uploader('/imgTweet', 'IMGTWT').array('images',1);

route.get('/all', postController.getData);
route.get('/post', readToken, postController.getPost);
route.post('/add', uploadFile, postController.addPost);
route.delete('/delete/:idPost', postController.deletePost);
route.post('/postDetails/:idPost', postController.postDetails);

module.exports = route;