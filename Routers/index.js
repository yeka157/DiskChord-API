const authRouter = require('./auth');
const postRouter = require('./post');
const likeRouter = require('./likes');
const commentRouter = require('./comment');
module.exports = {
    authRouter,
    postRouter,
    likeRouter,
    commentRouter
}