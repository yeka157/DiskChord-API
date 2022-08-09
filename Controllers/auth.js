const { dbConf, dbQuery } = require('../config/db');
const { hashPassword, createToken } = require('../config/encrypt');
const { transport } = require('../config/nodemailer');
module.exports = {
    getData: (req,res) => {
        dbConf.query(`Select * from users;`,
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                }
                console.log(results);
                res.status(200).send(results);
            })
    },
    register: async(req,res) => {
        try {
            let sqlInsert = await dbQuery(`INSERT INTO users (name, username, email, password) values
            (${dbConf.escape(req.body.username)}, ${dbConf.escape(req.body.username)}, ${dbConf.escape(req.body.email)}, ${dbConf.escape(hashPassword(req.body.password))});`);
            console.log(sqlInsert);
        
            if (sqlInsert.insertId) {
                let sqlGet = await dbQuery(`Select idusers, email, status from users where idusers = ${sqlInsert.insertId};`);
                let token = createToken({...sqlGet[0]}, '1h');
        
                await transport.sendMail({
                    from : 'DiskChord',
                    to : sqlGet[0].email,
                    subject : 'Verification Email Account',
                    html : `<div>
                    <h3>Welcome to DiskChord</h3>
                    <p>Please verify your account to continue using our features</p>
                    <a href='http://localhost:3000/verification/${token}'>Click here!</a>
                    </div>`
                })
                res.status(200).send({
                    success : true,
                    message : 'Register Success'
                })
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }, //done
    login: async(req,res) => {
        try {
            let account = '';
            let user = '';
            if (req.body.email) {
                account = req.body.email;
                user = "u.email";
            } else if (req.body.username) {
                account = req.body.username;
                user = "u.username";
            }
            let data = await dbQuery(`Select * from users u WHERE ${user} = ${dbConf.escape(account)} and u.password=${dbConf.escape(hashPassword(req.body.password))};`);
            if (data.length > 0) {
                let token = createToken({...data[0]});
                return res.status(200).send({...data[0], token});
            } else {
                return res.status(200).send(data);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }, //done
    keepLogin : async(req,res) => {
        try {
            let data = await dbQuery(`Select u.idusers, u.name, u.username, u.email, u.status, u.user_bio, u.user_profilepicture from users u where idusers = "${req.dataToken.idusers}";`);
            let token = createToken({...data[0]});
            res.status(200).send({...data[0], token});
        } catch (error) {
            res.status(500).send(error);
        }
    }, //done
    verify: async(req,res) => {
        try {
            await dbQuery(`UPDATE users set status = "Verified" where idusers = "${req.dataToken.idusers}";`);
            let data = await dbQuery(`Select u.idusers, u.name, u.username, u.email, u.status, u.bio, u.user_profilepicture from users u where u.idusers = "${req.dataToken.idusers}";`);
            let token = createToken({...data[0]});
            res.status(200).send({...data[0], token});
        } catch (error) {
            res.status(500).send(error);
        }
    },
    getUsername : (req,res) => {
        dbConf.query(`Select users.username from users where username like "%${req.body.username}%";`, 
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(results)
            })
    }, // done
    getEmail : (req,res) => {
        dbConf.query(`Select users.email from users where email like "${req.body.email}%";`, 
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(results);
            })
    }, // done
    forgotPassword : async(req,res) => {
        try {
            
        } catch (error) {
           console.log(error); 
           res.status(500).send(error);
        }
    }
} 