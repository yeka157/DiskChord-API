const Crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
    hashPassword:(pass) => {
        return Crypto.createHmac("sha256", "diskchord").update(pass).digest("hex");
    },
    createToken : (payload, expiresIn = '24h') => {
        let token = jwt.sign(payload, 'account', {
            expiresIn
        });

        return token;
    },
    readToken: (req,res,next) => {
        jwt.verify(req.token, 'account', (err,decode) => {
            if (err) {
                return res.status(401).send({message: 'Authenticate error'})
            }
            req.dataToken = decode;

            next();
        })
    }
}