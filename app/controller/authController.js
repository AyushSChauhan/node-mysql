const bcrypt = require('bcrypt');
const saltRounds = 10;
const logger = require('../logger/logger');
const Otp = require('../middleware/otp');
const db = require('../dbConnection/db');
const { registrationValidate, loginValidate, EmailValidate, updatePasswordValidate, resetpasswordValidate, updateProfileValidate } = require('../validation/authValidation');

const otp = Math.floor(100000 + Math.random() * 900000);
logger.info(otp);

exports.registration = async(req, res) => {
    try {
        console.log(req.body);
        let { error } = registrationValidate(req.body);
        if (error) {
            console.log('error', error);
            res.status(400).send(error.details[0].message);
        } if (!req.file) {
            res.send("image is required...");
         } else {
            const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
            const fname = req.body.fname;
            const lname = req.body.lname;
            const gender = req.body.gender;
            const hobby = req.body.hobby;
            const mobile = req.body.mobile;
            const image = req.file.filename;
            const city = req.body.city;
            const email = req.body.email;
            const password = encryptedPassword;
            
            const sql = `INSERT INTO auth(fname,lname,gender,hobby,mobile,image,city,email,password)VALUES('${fname}','${lname}','${gender}','${hobby}','${mobile}','${image}','${city}','${email}','${password}')`;

            db.query(sql, (err, result) => {
                if (err) {
                    logger.error('Error', err);
                } else {
                    res.send("record Inserted....");
                }
            });
        }
        
    } catch (err) {
        logger.error("err", err);
    }
};


exports.login = async(req, res) => {

    try {

        let { error } = loginValidate(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);

        } else {
            const email = req.body.email;
            db.query(`SELECT * FROM auth WHERE email = ?`, [email], async(err, response) => {
                if (err) {
                    logger.error("error", err);
                } else {
                    if (response.length > 0) {

                        const comparison = await bcrypt.compare(req.body.password, response[0].password);
                        if (comparison)
                            res.send("login Success...");
                        else
                            res.send("Password is not correct..");

                    } else {
                        res.send("login Not Valid...");
                    }
                }
            });
        }
    } catch (err) {
        logger.error("err", err);
    }

};


exports.verifyEmail = async(req, res) => {
    try {
        let { error } = EmailValidate(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            const email = req.body.email;
            db.query(`SELECT * FROM auth WHERE email = ?`, [email], async(err, response) => {
                if (err) {
                    logger.error("error", err);
                } else {
                    if (response.length > 0) {
                        Otp(req.body.email, otp);
                        res.send("OTP Sended...")
                    } else {
                        res.send("Email invalid...")
                    }
                }
            });

        }
    } catch (err) {
        logger.error("err", err);
    }
};

exports.verifyOtp = async(req, res) => {
    try {

        if (otp == req.body.otp) {
            res.send("OTP is valid, Login SuccessFully");

        } else {
            res.send("OTP is invalid");
        }

    } catch (err) {
        logger.error("err", err);

    }
};

exports.updatePassword = async(req, res) => {
    try {
        let { error } = updatePasswordValidate(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            const email = req.body.email;
            db.query(`SELECT * FROM auth WHERE email = ?`, [email], async(err, response) => {
                if (response) {

                    const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
                    if (encryptedPassword) {
                        db.query(`UPDATE auth set password=? WHERE email=?`, [encryptedPassword, email]);
                        res.send("Password Updated....")
                    } else {
                        res.send("Invalid Password");
                    }
                }
            });

        }

    } catch (err) {
        logger.error("err", err);
    }
};

exports.resetPassword = async(req, res) => {
    try {
        let { error } = resetpasswordValidate(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            if (req.files.length === 0) {
                res.send("image is required...");
             } else{
            const email = req.user.email;
            db.query(`SELECT * FROM auth WHERE email = ?`, [email], async(err, response) => {
                if (err) {
                    logger.error("error", err);
                }
                if (response) {

                    const comparison = await bcrypt.compare(req.body.current_password, response[0].password);
                    if (comparison) {
                        const updatePassword = await bcrypt.hash(req.body.password, saltRounds);
                        db.query(`UPDATE auth set Password='${updatePassword}'WHERE email=?`, [email], async(err1, response1) => {
                            if (response1) {
                                res.send("Your Password has been Reset");
                            } else {
                                res.send("Your Password has not been Reset");
                            }
                        });


                    } else {
                        res.send("Current Password is incorrect");
                    }

                }
            });

        }
    }

    } catch (err) {
        logger.error("err", err);
    }
};

exports.viewProfile = async(req, res) => {
    try {
        const email = req.user.email;
        db.query(`SELECT * FROM auth WHERE email = ?`, [email], async(err, response) => {
            if (err) {
                logger.error("error", err);
            } else {

                res.send(response);

            }
        });

    } catch (err) {
        logger.error("err", err);
    }
};


exports.updateProfile = async(req, res) => {
    try {
        const { error } = updateProfileValidate(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
        } if (!req.file) {
            res.send("image is required...");
         } else {
            const email = req.user.email;
            db.query(`SELECT * FROM auth WHERE email = ?`, [email], async(err, response) => {
                if (err) {
                    logger.error("error", err);
                }
                if (response) {
                    const fname = req.body.fname;
                    const lname = req.body.lname;
                    const gender = req.body.gender;
                    const hobby = req.body.hobby;
                    const mobile = req.body.mobile;
                    const image = req.file.filename;
                    const city = req.body.city;
                    const email = req.body.email;
                    db.query(`UPDATE auth set fname='${fname}',lname='${lname}',gender='${gender}',hobby='${hobby}',mobile='${mobile}',image='${image}',city='${city}',email='${email}'WHERE email=?`, [req.user.email], async(err1, response1) => {
                        if (response1) {
                            res.send("Profile Updated....");
                        } else {
                            res.send("Profile not Updated....");
                        }
                    });

                }
            });

        }

    } catch (err) {
        logger.error("err", err);
    }
};


exports.logout = async(req, res) => {
    try {
        res.clearCookie("jwt");
        res.clearCookie("id");
        res.send('logout Done.....')
    } catch (err) {
        logger.error("err", err)
    }
};