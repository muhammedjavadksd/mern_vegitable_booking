const UserModal = require("../modals/userModal")
let bcrypt = require("bcrypt")
const saltRounds = 10;
let userHelper = require("../helper/UserHelper/userHelperMethod")
let const_data = require("../config/const");
let crypto = require("crypto");
const { default: mongoose, mongo } = require("mongoose");
const userHelperMethod = require("../helper/UserHelper/userHelperMethod");
var jwt = require('jsonwebtoken');
let tokenHelper = require("../helper/Token/TokenHelper")

const userController = {
    userLoginPost: (req, res) => {
        let { username, password } = req.body;

        UserModal.findOne({
            $or: [
                { email: username },
                { username: username },
            ]
        }).then((user) => {
            console.log(user)
            if (user) {
                if (user.isOtpValidated) {
                    bcrypt.compare(password, user.password, function (err, result) {
                        if (err) {
                            res.status(404).send({ status: false, error: true, msg: "Incorrect Password" })
                        } else {
                            res.status(200).send({ status: true, error: false, user, msg: "Loggin success" })
                        }
                    });
                } else {
                    res.status(404).send({ status: false, error: true, msg: "OTP Is not validated" })
                }
            } else {
                res.status(404).send({ status: false, error: true, msg: "Username/email address couldn't find" })
            }
        }).catch((err) => {
            res.status(404).send({ status: false, error: true, msg: "Something Went Wrong" + err })
        })
    },


    userSignUpPost: (req, res) => {

        let { firstName, lastName, phone, password, email } = req.body
        let userName = "";

        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                res.status(404).send({ status: false, error: true, msg: "PASSWORD HASH FAILED" })
            } else {

                let otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
                let userData = {
                    username: userName,
                    email: email,
                    mobile: phone,
                    first_name: firstName,
                    last_name: lastName,
                    password: hash,
                    otp: otp
                }

                UserModal.findOne({
                    $or: [
                        { email },
                        { mobile: phone },
                    ]
                }).then(async (findUser) => {
                    console.log("User", findUser)
                    if (findUser != null) {
                        if (findUser.isOtpValidated) {
                            res.send({ status: false, error: true, msg: "User Already Exits" });
                            process.exit(1)
                        } else {
                            userData._id = findUser._id;
                        }
                    }
                    try {
                        console.log("Final Data", userData)
                        let userSignUp = await userHelper.userSignUp(userData);
                        console.log(userSignUp)
                        if (userSignUp) {
                            try {
                                await userHelper.sendOTPSignup(otp, email)
                                res.send({ status: true, user: userSignUp })
                            } catch (e) {
                                res.send({ status: false, error: true, msg: "OTP Sending Failed" })
                            }
                        } else {
                            res.send({ status: false, error: true, msg: "User Insertion Failed" })
                        }
                    } catch (e) {
                        res.send({ status: false, error: err.message })
                    }
                })
            }
        })
    },



    forgetPassword: function (req, res) {

        let email = req.body.email;

        UserModal.findOne({ email }).then(async (user) => {
            if (user) {

                let token = crypto.randomBytes(64).toString("hex");
                UserModal.updateOne(
                    {
                        _id: new mongoose.Types.ObjectId(user._id)
                    },
                    {
                        $set: {
                            token: token,
                            tokenExpire: Date.now() + 300000
                        }
                    }
                ).then((updated) => {
                    console.log(updated)
                    userHelper.sendForgetPasswordEmail(email, const_data.DOMAIN_NAME + "/reset_password/" + token, user.username).then(() => {
                        res.send({ status: true, error: false, msg: "Email successfuly sended" })
                    }).catch(() => {
                        res.send({ status: false, error: true, msg: "Email sending failed" })
                    })
                }).catch((err) => {
                    res.send({ status: false, error: true, msg: "Something Went Wrong" })
                })

            } else {
                res.send({ status: false, error: true, msg: "Email address couldn't found" })
            }
        }).catch((err) => {
            res.send({ status: false, error: true, msg: "Something Went Wrong" })
        })
    },

    resetPassword: async function (req, res) {
        let tokenID = req.body.token;
        let password = req.body.password;

        let isTokenValid = await userHelper.tokenValidation(tokenID)

        if (isTokenValid) {
            bcrypt.hash(password, saltRounds, (err, newPassword) => {
                if (!err) {
                    UserModal.findOneAndUpdate(
                        {
                            token: tokenID
                        },
                        {
                            password: newPassword,
                            token: "",
                            tokenExpire: 0
                        }
                    ).then((data) => {
                        res.send({ status: true, error: false, msg: "Password successfully updated" })
                    }).catch((err) => {
                        res.send({ status: false, error: true, msg: "Password failed to update" })
                    })
                } else {
                    res.send({ status: false, error: true, msg: "Password failed to update" })
                }
            })
        } else {
            res.send({ status: false, error: true, msg: "Token is not valid" })
        }
    },

    tokenValidation: async function (req, res) {
        let token = req.params.token;
        let isTokenValid = await userHelperMethod.tokenValidation(token);
        if (isTokenValid) {
            res.send({ status: true, error: false, msg: "Token is Valid" })
        } else {
            res.send({ status: false, error: true, msg: "Token is not valid anymore" })
        }
    },


    validateJWT: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            let access_token = req.headers.authorization.split(' ')[1];
            try {
                jwt.verify(access_token, process.env.JWT_SECRET, (err, data) => {
                    if (err) res.status(403).send({ status: false, error: true, msg: "Token is not valid" })
                    else res.status(200).send({ status: true, error: false, msg: "Token is   valid" })
                })
            } catch (err) {
                res.status(403).send({ status: false, error: true, msg: "Token is not valid" })
            }
        } else {
            res.status(403).send({ status: false, error: true, msg: "Token is not valid" })
        }
    },

    reGenerateJWT: function (req, res) {
        let referenceRefresh = req.query.refresh_token;

        UserModal.findById(referenceRefresh).then((user) => {
            if (user) {
                try {
                    let accessToken = tokenHelper.TokenGenerator(user)
                    res.send({ status: true, token: accessToken, error: false })
                } catch (e) {
                    res.send({ status: false, error: true })
                }
            } else {
                res.send({ status: false, error: true, msg: "Token is completly invalid" })
            }
        }).catch((err) => {
            res.send({ status: false, error: true, msg: "Something Went Wrong" })
        })
    },

    otpValidation: function (req, res) {
        let otp = req.body.otp;
        let userid = req.body.userid;

        UserModal.findOne({ otp, _id: new mongoose.Types.ObjectId(userid) }).then((user) => {
            if (user) {
                let otp_validity = user.otp_validity;
                console.log(otp_validity)
                if (otp_validity > Date.now()) {
                    UserModal.updateOne({ _id: new mongoose.Types.ObjectId(userid) }, { $set: { isOtpValidated: true } }).then((userUpdated) => {
                        if (userUpdated && userUpdated.modifiedCount > 0) {
                            res.send({ status: true, error: false, msg: "OTP validated success" })
                        } else {
                            res.send({ status: false, error: true, msg: "Something went wrong" })
                        }
                    })
                } else {
                    res.send({ status: false, error: true, msg: "OTP Expired" })
                }
            } else {
                res.send({ status: false, error: true, msg: "Incorrect OTP" })
            }
        }).catch((err) => {
            res.send({ status: false, error: true, msg: "Something Went Wrong" })
        })
    }
}


module.exports = userController;