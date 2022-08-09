const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const App = express();
const cors = require('cors');
const PORT = process.env.PORT;
const bearerToken = require('express-bearer-token');

App.use(express.static('public'));
App.use(express.json());
App.use(cors({}));
App.use(bearerToken());
App.get('/', (req,res) => {
    res.status(200).send('<h1>Server Running</h1>');
})

const { dbConf } = require('./config/db');
dbConf.getConnection((error, connection) => {
    if (error) {
        console.log(error.sqlMessage);
    }
    console.log('Connect', connection.threadId);
})

const { authRouter, postRouter, likeRouter, commentRouter } = require('./Routers');

App.use('/auth', authRouter);
App.use('/tweet', postRouter);
App.use('/likes', likeRouter);
App.use('/comment', commentRouter);
 
App.listen(PORT, ()=> console.log('Running on PORT', PORT));