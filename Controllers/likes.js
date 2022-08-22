const e = require("express");
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
    }, //unused
    addLike : async(req,res) => {
        try {
            let sqlGet = await dbQuery(`Select * from likes where post_id = ${dbConf.escape(req.body.idPost)} AND user_id = ${dbConf.escape(req.body.user_id)};`);
            console.log(sqlGet);
            if (sqlGet.length > 0) {
                let deleteSql = await dbQuery(`Delete from likes where idlikes = ${dbConf.escape(sqlGet[0].idlikes)};`);
                return res.status(200).send({success : true});
            } else {
                let send = await dbQuery(`INSERT INTO likes (post_id, user_id) values (${dbConf.escape(req.body.idPost)}, ${dbConf.escape(req.body.user_id)});`);
                console.log(send);
                if (send.insertId) {
                    return res.status(200).send({success : true});
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }, //done
    unLike : async (req,res) => {
        try {
            console.log(req.body);
            let sqlGet = await dbQuery(`Select * from likes where post_id = ${dbConf.escape(req.body.idPost)} AND user_id = ${dbConf.escape(req.body.user_id)};`);
            console.log(sqlGet);
            let deleteSql = await dbQuery(`DELETE FROM likes where idlikes = ${dbConf.escape(sqlGet[0].idlikes)};`); 
            res.status(200).send({success : true});
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    } //ga kepake
}
