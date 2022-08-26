const { dbConf, dbQuery } = require('../config/db');
const { hashPassword, createToken } = require('../config/encrypt');
const { transport } = require('../config/nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const fs = require('fs');
module.exports = {
    register: async(req,res) => {
        try {
            const handlebarOptions = {
                viewEngine : {
                    extName : '.handlebars',
                    partialsDir : path.resolve('./template'),
                    defaultLayout : false,
                },
                viewPath : path.resolve('./template'),
                extName : '.handlebars',
            }
            transport.use('compile', hbs(handlebarOptions));
            let sqlInsert = await dbQuery(`INSERT INTO users (name, username, email, password) values
            (${dbConf.escape(req.body.username)}, ${dbConf.escape(req.body.username)}, ${dbConf.escape(req.body.email)}, ${dbConf.escape(hashPassword(req.body.password))});`);
            console.log(sqlInsert);
        
            if (sqlInsert.insertId) {
                let sqlGet = await dbQuery(`Select idusers, email, status from users where idusers = ${sqlInsert.insertId};`);
                let token = createToken({...sqlGet[0]}, '1h');
                let link = `http://localhost:3000/verification/${token}`;
                let name = sqlGet[0].username;
                transport.sendMail({
                    from : 'DiskChord',
                    to : sqlGet[0].email,
                    subject : 'Verification Email Account',
                    template : 'email',
                    context : {
                        name,
                        link
                    }
                })
                res.status(200).send({
                    success : true,
                    message : 'Register Success',
                    token
                })
            }
        } catch (error) {
            res.status(500).send(error);
        }
    },
    login: async(req,res) => {
        try {
            let data = await dbQuery(`Select * from users u WHERE ${req.body.email ? 'u.email' : 'u.username'} = ${req.body.email? dbConf.escape(req.body.email) : dbConf.escape(req.body.username)} and u.password=${dbConf.escape(hashPassword(req.body.password))};`);
            if (data.length > 0) {
                let token = createToken({...data[0]});
                return res.status(200).send({...data[0], token});
            } else {
                return res.status(200).send(data);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    keepLogin : async(req,res) => {
        try {
            let data = await dbQuery(`Select u.idusers, u.name, u.username, u.email, u.status, u.user_bio, u.user_profilepicture from users u where idusers = "${req.dataToken.idusers}";`);
            let token = createToken({...data[0]});
            res.status(200).send({...data[0], token});
        } catch (error) {
            res.status(500).send(error);
        }
    },
    verify: async(req,res) => {
        try {
            // let result = await dbQuery(`Select * from token where jwt=${dbConf.escape(req.token)}`)
            await dbQuery(`UPDATE users set status = "Verified" where idusers = ${dbConf.escape(req.dataToken.idusers)};`);
            let data = await dbQuery(`Select u.idusers, u.name, u.username, u.email, u.status, u.user_bio, u.user_profilepicture from users u where u.idusers = "${req.dataToken.idusers}";`);
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
    },
    getEmail : (req,res) => {
        dbConf.query(`Select users.email from users where email like "${req.body.email}%";`, 
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(results);
            })
    },
    sendVerify : async(req,res) => {
        try {
            const handlebarOptions = {
                viewEngine : {
                    extName : '.handlebars',
                    partialsDir : path.resolve('./template'),
                    defaultLayout : false,
                },
                viewPath : path.resolve('./template'),
                extName : '.handlebars',
            }
            transport.use('compile', hbs(handlebarOptions));

            let sqlGet = await dbQuery(`Select idusers, username, email, status from users where email = ${dbConf.escape(req.body.email)}`);
            let token = createToken({...sqlGet[0]}, '1h');
            let link = `http://localhost:3000/verification/${token}`;
            let name = sqlGet[0].username;
            console.log(sqlGet);
            transport.sendMail({
                from : 'DiskChord',
                to : sqlGet[0].email,
                subject : 'Verification Email Account',
                template : 'email',
                context : {
                    name,
                    link
                }
            })
            res.status(200).send({
                success : true,
                message : 'Email sent',
                token
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    updateProfile : async(req,res) => {
        try {
            console.log(req.files);
            let data = JSON.parse(req.body.data);
            let dataInput = [];
            for (const prop in data) {
                if (data[prop]) {
                    dataInput.push(dbConf.escape(data[prop]));
                }
            }
            dataInput.splice(1,0, dbConf.escape(`/imgProfile/${req.files[0].filename}`));
            if (data.username && data.name && data.user_bio) {
                let update = await dbQuery(`UPDATE users set username = ${dataInput[0]}, 
                user_profilepicture = ${dataInput[1]}, 
                name = ${dataInput[2]}, 
                user_bio = ${dataInput[3]} WHERE idusers = ${req.params.id};`);
            } else if (data.username && data.name) {
                let update = await dbQuery(`UPDATE users set username = ${dataInput[0]}, 
                user_profilepicture = ${dataInput[1]}, 
                name = ${dataInput[2]} WHERE idusers = ${req.params.id};`);
            } else if (data.username && data.user_bio) {
                let update = await dbQuery(`UPDATE users set username = ${dataInput[0]}, 
                user_profilepicture = ${dataInput[1]}, 
                user_bio = ${dataInput[2]} WHERE idusers = ${req.params.id};`);
            } else if (data.name && data.user_bio) {
                let update = await dbQuery(`UPDATE users set name = ${dataInput[0]}, 
                user_profilepicture = ${dataInput[1]}, 
                user_bio = ${dataInput[2]} WHERE idusers = ${req.params.id};`);
            } else if (data.username) {
                let update = await dbQuery(`UPDATE users set username = ${dataInput[0]}, 
                user_profilepicture = ${dataInput[1]} WHERE idusers = ${req.params.id};`);
            } else if (data.name) {
                let update = await dbQuery(`UPDATE users set name = ${dataInput[0]}, 
                user_profilepicture = ${dataInput[1]} WHERE idusers = ${req.params.id};`);
            } else if (data.user_bio) {
                let update = await dbQuery(`UPDATE users set user_bio = ${dataInput[0]},
                user_profilepicture = ${dataInput[1]} WHERE idusers = ${req.params.id};`);
            } else {
                let update = await dbQuery(`UPDATE users set user_profilepicture = ${dataInput[0]} WHERE idusers = ${req.params.id};`);
            }
            res.status(200).send({success : true});
        } catch (error) {
            console.log(error);
            fs.unlinkSync(`./public/imgProfile/${req.files[0].filename}`)
            res.status(500).send(error);
        }
    },
    updateNoImg : async(req,res) => {
        try {
            if (req.body.username && req.body.name && req.body.user_bio) {
                let update = await dbQuery(`UPDATE users set username = ${dbConf.escape(req.body.username)}, 
                name = ${dbConf.escape(req.body.name)}, user_bio = ${dbConf.escape(req.body.user_bio)}
                WHERE idusers = ${req.params.id};`);
            } else if (req.body.username && req.body.name) {
                let update = await dbQuery(`UPDATE users set username = ${dbConf.escape(req.body.username)},
                name = ${dbConf.escape(req.body.name)} WHERE idusers = ${req.params.id};`);
            } else if (req.body.username && req.body.user_bio) {
                let update = await dbQuery(`UPDATE users set username = ${dbConf.escape(req.body.username)},
                user_bio = ${dbConf.escape(req.body.user_bio)} WHERE idusers = ${req.params.id};`);
            } else if (req.body.name && req.body.user_bio) {
                let update = await dbQuery(`UPDATE users set name = ${dbConf.escape(req.body.name)}, 
                user_bio = ${dbConf.escape(req.body.user_bio)} WHERE idusers = ${req.params.id};`);
            } else if (req.body.username) {
                let update = await dbQuery(`UPDATE users set username = ${dbConf.escape(req.body.username)} WHERE idusers = ${req.params.id};`);
            } else if (req.body.name) {
                let update = await dbQuery(`UPDATE users set name = ${dbConf.escape(req.body.name)} WHERE idusers = ${req.params.id};`);
            } else if (req.body.user_bio) {
                let update = await dbQuery(`UPDATE users set user_bio = ${dbConf.escape(req.body.user_bio)} WHERE idusers = ${req.params.id};`);
            }
            res.status(200).send({success : true})
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    },
    resetPassword : async(req,res) => {
        try {
            console.log(req.dataToken);
            let result = await dbQuery(`UPDATE users set password = ${dbConf.escape(hashPassword(req.body.password))} where idusers = ${dbConf.escape(req.dataToken.idusers)};`);
            res.status(200).send({success : true});
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    sendReset : async(req,res) => {
        try {
            const handlebarOptions = {
                viewEngine : {
                    extName : '.handlebars',
                    partialsDir : path.resolve('./template'),
                    defaultLayout : false,
                },
                viewPath : path.resolve('./template'),
                extName : '.handlebars',
            }
            transport.use('compile', hbs(handlebarOptions));

            let sqlGet = await dbQuery(`Select idusers, username, email, status from users where email = ${dbConf.escape(req.body.email)}`);
                let token = createToken({...sqlGet[0]}, '1h');
                let link = `http://localhost:3000/reset/${token}`;
                let name = sqlGet[0].username;
                console.log(sqlGet);
                console.log(token);
                transport.sendMail({
                    from : 'DiskChord',
                    to : sqlGet[0].email,
                    subject : 'Reset Password',
                    template : 'reset',
                    context : {
                        name,
                        link
                    }
                })
            res.status(200).send({
                success : true,
                message : 'Email sent',
                token
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
}