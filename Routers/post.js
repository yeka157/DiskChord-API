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
route.get('/postDetails/:idPost', postController.postDetails);
route.patch('/update/:id', postController.editPost);
route.post('/more', postController.morePost);
route.get('/allPost', postController.getAllPost);
route.get('/liked', readToken, postController.getLikedPost);
module.exports = route;