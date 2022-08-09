const { dbConf, dbQuery } = require("../config/db");

module.exports  = {
    getData : (req,res) => {
        dbConf.query(`Select * from comments;`,
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(results);
            })
    },
    addComment : (req,res) => {
        dbConf.query(`INSERT INTO comments (text, post_id, user_id) values
        ("${req.body.text}", "${req.body.idPost}", "${req.body.id}");`, 
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(results);
            })
    },

}