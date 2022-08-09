const { dbConf, dbQuery } = require("../config/db");
const fs = require('fs');

module.exports = {
    getData: async(req,res) => {
        try {
            let results = await dbQuery(`Select p.idPost, p.user_id, p.date, p.image, p.text, u.name, u.username from post p
            JOIN users u ON u.idusers = p.user_id
            order by p.date desc;`);
            let temp = [];
            for (let i=0; i<results.length; i++) {
                let data = await dbQuery(`Select * from likes where post_id=${dbConf.escape(results[i].idPost)};`);
                let reply = await dbQuery(`Select * from comments where post_id=${dbConf.escape(results[i].idPost)};`);
                temp.push({...results[i], likes : data, comments : reply});
            }
            res.status(200).send(temp);
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }, //done
    getPost: async(req,res) => {
        try {
            let results = await dbQuery(`Select p.idPost, p.user_id, p.date, p.image, p.text, u.name, u.username from post p
            JOIN users u ON u.idusers = p.user_id
            where u.idusers = "${req.dataToken.idusers}"
            order by p.date desc;`);
            let temp = [];
            for (let i = 0; i<results.length; i++) {
                let data = await dbQuery(`Select * from likes where post_id=${dbConf.escape(results[i].idPost)};`);
                let reply = await dbQuery(`Select * from comments where post_id=${dbConf.escape(results[i].idPost)};`);
                temp.push({...results[i], likes : data, comments : reply});
            }
            res.status(200).send(temp);
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }, //done
    addPost : async(req,res) => {
        try {
            console.log(req.files);
            let data = JSON.parse(req.body.data);
            let dataInput = [];
            for (const prop in data) {
                dataInput.push(dbConf.escape(data[prop]));
            }
            dataInput.splice(1,0, dbConf.escape(`/imgTweet/${req.files[0].filename}`));
            console.table(dataInput);
            let addData = await dbQuery(`INSERT INTO post (user_id, image, text) values (${dataInput.join(',')});`)
            let select = await dbQuery(`Select p.idPost from post p order by p.idPost desc;`)
            console.log(select[0]);
            res.status(200).send({
                ...select[0]
            })
        } catch (error) {
            console.log(error);
            fs.unlinkSync(`./public/imgTweet/${req.files[0].filename}`)
            res.status(500).send(error);
        }
    }, //done
    deletePost : async (req,res) => {
        try {
            await dbQuery(`Delete from post where idPost=${req.params.idPost}`);
            res.status(200).send({success:true});
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    editPost : (req,res) => {

    },
    postDetails : async (req,res) => {
        try {
            let results = await dbQuery(`Select p.idPost, p.user_id, p.date, p.image, p.text, u.name, u.username from post p
            JOIN users u ON u.idusers = p.user_id
            where p.idPost = ${req.body.idPost};`);
            let temp = [];
            let data = await dbQuery(`Select * from likes where post_id=${dbConf.escape(results[0].idPost)};`);
            let reply = await dbQuery(`Select * from comments where post_id=${dbConf.escape(results[0].idPost)};`);
            temp.push({...results[0], likes : data, comments : reply});
            res.status(200).send(temp);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}


// `Select p.*, u.name, u.username, count(likes.user_id) as totalLikes from post p 
//         JOIN users u ON u.idusers = p.user_id 
//         JOIN likes ON likes.post_id = p.idPost
//         order by p.date desc;`


