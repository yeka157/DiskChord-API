const express = require('express');
const { readToken } = require('../config/encrypt');
const { uploader } = require('../config/uploader');
const { postController } = require('../Controllers');
const route = express.Router();

const uploadFile = uploader('/imgTweet', 'IMGTWT').array('images',1);

route.get('/all', postController.getData); // done
route.get('/post', readToken, postController.getPost); // done
route.post('/add', uploadFile, postController.addPost); // done
route.delete('/delete/:idPost', postController.deletePost); //done
route.get('/postDetails/:idPost', postController.postDetails); // done
route.patch('/update/:id', postController.editPost); // done
route.post('/more', postController.morePost); //infinite scroll
route.get('/allPost', postController.getAllPost); //done
route.get('/liked', readToken, postController.getLikedPost); //done
module.exports = route;