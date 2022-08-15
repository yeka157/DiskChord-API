const { dbConf, dbQuery } = require('../config/db');
const { hashPassword, createToken } = require('../config/encrypt');
const { transport } = require('../config/nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const fs = require('fs');
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
    }, //done
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
            // let result = await dbQuery(`Select * from token where jwt=${dbConf.escape(req.token)}`)
            await dbQuery(`UPDATE users set status = "Verified" where idusers = ${dbConf.escape(req.dataToken.idusers)};`);
            let data = await dbQuery(`Select u.idusers, u.name, u.username, u.email, u.status, u.user_bio, u.user_profilepicture from users u where u.idusers = "${req.dataToken.idusers}";`);
            let token = createToken({...data[0]});
            res.status(200).send({...data[0], token});
        } catch (error) {
            res.status(500).send(error);
        }
    }, //done
    getUsername : (req,res) => {
        dbConf.query(`Select users.username from users where username like "%${req.body.username}%";`, 
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(results)
            })
    }, //done
    getEmail : (req,res) => {
        dbConf.query(`Select users.email from users where email like "${req.body.email}%";`, 
            (err,results) => {
                if (err) {
                    res.status(500).send(err);
                }
                res.status(200).send(results);
            })
    }, //done
    forgotPassword : async(req,res) => {
        try {
            
        } catch (error) {
           console.log(error); 
           res.status(500).send(error);
        }
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
                // html : `<div>
                // <h3>Welcome to DiskChord</h3>
                // <p>Please verify your account to continue using our features</p>
                // <a href='http://localhost:3000/verification/${token}'>Click here!</a>
                // </div>`
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
            let dataVal = [];
            for (const prop in data) {
                if (data[prop]) {
                    dataInput.push(dbConf.escape(data[prop]));
                    dataVal.push(`${prop}`)
                }
            }
            dataInput.splice(1,0, dbConf.escape(`/IMGPRFL/${req.files[0].filename}`));
            dataVal.splice(1,0, `user_profilepicture`);
            let inputData = [];
            if (dataVal.length === dataInput.length) {
                for (let i =0; i<dataVal.length; i++) {
                    inputData.push(`${dataVal[i]} = ${dbConf.escape(dataInput[i])}`)
                }
            }
            let addData = await dbQuery(`UPDATE users set ${inputData.join(',')} where idusers = ${req.params.id};`)
            res.status(200).send({success : true});
        } catch (error) {
            console.log(error);
            fs.unlinkSync(`./public/imgProfile/${req.files[0].filename}`)
            res.status(500).send(error);
        }
    },
    updateNoImg : async(req,res) => {
        try {
            let data = JSON.parse(req.body.data);
            let dataInput = [];
            let dataVal = [];
            for (const prop in data) {
                if (data[prop]) {
                    dataInput.push(dbConf.escape(data[prop]));
                    dataVal.push(`${prop}`);
                }
            }
            let inputData = [];
            if (dataVal.length === dataInput.length) {
                for (let i = 0; i<dataVal.length; i++) {
                    inputData.push(`${dataVal[i]} = ${dbConf.escape(dataInput[i])}`)
                }
            }
            let addData = await dbQuery(`UPDATE users set ${inputData.join(',')} where idusers = ${req.params.id};`)
            res.status(200).send({success : true})
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }
} 