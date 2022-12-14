const { dbConf, dbQuery } = require("../config/db");

module.exports  = {
    addComment : async(req,res) => {
        try {
            let add = await dbQuery(`INSERT INTO comments (text, post_id, user_id) values
            (${dbConf.escape(req.body.text)}, ${dbConf.escape(req.params.id)}, ${dbConf.escape(req.body.idusers)});`);
            if (add.insertId) {
                return res.status(200).send({success : true});
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getComment : async(req,res) => {
        try {
            let result = await dbQuery(`Select c.idComments, c.date, c.text, c.post_id, u.idusers, u.name, u.username, u.user_profilepicture from comments c 
            JOIN users u ON u.idusers = c.user_id
            WHERE c.post_id=${dbConf.escape(req.params.id)} order by c.date desc limit 5 offset 0;`);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getMoreComment : async(req,res) => {
        try {
            let result = await dbQuery(`Select c.idComments, c.date, c.text, c.post_id, u.idusers, u.name, u.username, u.user_profilepicture from comments c 
            JOIN users u ON u.idusers = c.user_id
            WHERE c.post_id=${dbConf.escape(req.params.id)} order by c.date desc limit ${dbConf.escape(req.body.limit)} offset ${dbConf.escape(req.body.offset)};`);
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    getAllComment : async(req,res) => {
        try {
            let result = await dbQuery(`Select c.idComments, c.date, c.text, c.post_id, u.idusers, u.name, u.username, u.user_profilepicture from comments c 
            JOIN users u ON u.idusers = c.user_id
            WHERE c.post_id=${dbConf.escape(req.params.id)} order by c.date desc;`);
            console.log(result.length);
            res.status(200).send({length : result.length});
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
}