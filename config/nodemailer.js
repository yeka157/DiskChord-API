const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'diskchordkevin@gmail.com',
        pass : 'joplgcpdlvciwdav'
    }
})

module.exports = {
    transport
}