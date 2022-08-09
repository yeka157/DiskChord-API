const authController = require('./auth');
const postController = require('./post');
const likeController = require('./likes');
const commentController = require('./comment');

module.exports = {
    authController,
    postController,
    likeController,
    commentController
}