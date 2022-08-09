const { dbConf, dbQuery } = require("../config/db");

module.exports = {
    getLike : (req,res) => {
        dbConf.query(`Select * from likes;`, 
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(results);
            })
    },
    addLike : (req,res) => {
        dbConf.query(`INSERT INTO likes
        (post_id, user_id) values
        ("${req.body.idPost}", "${req.body.user_id}");`,
                (err,results) => {
                    if (err) {
                        res.status(500).send(err);
                        console.log(err);
                    }
                    console.log(results);
                    res.status(200).send({success:true});
                })
    },
    unLike : async (req,res) => {
        try {
            console.log(req.body.id);
            console.log(req.body.user_id);
            await dbQuery(`Delete from likes where post_id="${req.body.id}" AND user_id = "${req.body.user_id}";`);
            res.status(200).send({success:true});
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    likeUnlike : (req,res) => {
        dbConf.query(`Select likes.* from likes 
        JOIN users ON users.idusers = likes.user_id
        JOIN post ON post.idPost = likes.post_id
        WHERE users.idusers = ${req.body.id}
        AND post.idPost = ${req.body.idPost};`,
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(results);
            })
    },
    newLike : (req,res) => {
        dbConf.query(`INSERT INTO likes (post_id) values
        (${dbConf.escape(req.body.idPost)});`,
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                    console.log(err);
                }
                console.log(results);
                res.status(200).send({success:true});
            })
    }
}