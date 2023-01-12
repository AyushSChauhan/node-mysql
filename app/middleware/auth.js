const jwt = require("jsonwebtoken");
const logger = require('../logger/logger');



const generateToken = (req, res, next) => {
    let token = jwt.sign({ email: req.body.email }, process.env.PRIVATE_KEY);
    res.cookie("jwt", token)
    console.log("token", token);
    next();
};


const authenticate = (req, res, next) => {
    try {

        const token = req.cookies.jwt;


        if (token == undefined) {
            res.send('Enter Token..');
        }

        const verifyUser = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = verifyUser;

        next();
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    authenticate,
    generateToken
};