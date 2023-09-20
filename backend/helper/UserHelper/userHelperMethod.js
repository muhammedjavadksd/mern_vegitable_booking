let emailConfig = require("../../config/emailConfig")
let nodeMailer = require("nodemailer");
let const_data = require("../../config/const");
let UserModal = require("../../modals/userModal");
const { default: mongoose } = require("mongoose");
const OrdersModalDb = require("../../modals/OrderModal");
const UserModalDb = require("../../modals/userModal");
const wishListModelDb = require("../../modals/WishListModel");
const addressModelDB = require("../../modals/AddressModel");

let userHelperMethod = {

    sendForgetPasswordEmail: async (email, url, name) => {
        let mailerConfig = emailConfig.emailConfigObject;
        let mailTransport = nodeMailer.createTransport({
            service: mailerConfig.service,
            auth: mailerConfig.auth
        })



        let text = `Dear ${name} <br>,

        We received a request to reset your password for your ${const_data.WEBSITE_NAME} account. If you did not initiate this request, please ignore this email. Your account security is important to us <br>.
        
        If you did request a password reset, please follow the instructions below to reset your password:
        
        1. Click the following link to reset your password: <a href="${url}">Click here for reset password</a> <br>
         
        2. You will be directed to a page where you can create a new password for your account. <br>

        3. Password valid only for next 5 miniuts  <br>
        
        Please ensure that this request was initiated by you. If you have any concerns about the security of your account, please contact our support team immediately. <br>
        
        Thank you for using ${const_data.WEBSITE_NAME} <br>
        
        Best regards, <br>
        ${const_data.WEBSITE_NAME}
        `;



        let mailOption = {
            from: mailerConfig.auth.user,
            to: email,
            subject: 'Password Reset',
            html: text
        };

        await mailTransport.sendMail(mailOption, (err, info) => {
            if (err) {
                return Promise.reject()
            } else {
                return Promise.resolve();
            }
        })
    },

    tokenValidation: async function (token) {
        try {
            let findUserByToken = await UserModal.findOne({ token: token });

            if (findUserByToken) {
                let currentDate = Date.now();
                if (findUserByToken.tokenExpire > currentDate) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    },

    sendOTPSignup: async function (otp, email) {
        let mailerConfig = emailConfig.emailConfigObject;
        let mailTransport = nodeMailer.createTransport({
            service: mailerConfig.service,
            auth: mailerConfig.auth
        })



        let text = `Welcome ${const_data.WEBSITE_NAME} ! We're excited to have you as a new member of our community. To complete your registration, we just need to verify your email address.

        <br>Your One-Time Password (OTP) for email verification is: ${otp} <br>
        
        Please enter this OTP code on the verification page <br>
         
        (Note: The OTP code is valid for next 5 miniuts.) <br>
        
        If you didn't sign up for ${const_data.WEBSITE_NAME}, please ignore this email. Your account security is important to us.<br>
        
        Thank you for choosing ${const_data.WEBSITE_NAME}. If you have any questions or need assistance, feel free to reach out to our support team.
        `;



        let mailOption = {
            from: mailerConfig.auth.user,
            to: email,
            subject: 'OTP Verification',
            html: text
        };

        await mailTransport.sendMail(mailOption, (err, info) => {
            if (err) {
                return Promise.reject()
            } else {
                return Promise.resolve();
            }
        })
    },


    userSignUp: async function (user) {

        user.otp_validity = Date.now() + 300000
        try {
            let newUser;
            if (user && user._id) {
                newUser = await UserModal.findByIdAndUpdate(
                    user._id,
                    { $set: user },
                    { new: true, upsert: true }
                );
            } else {
                user.isOtpValidated = false;
                newUser = await UserModal.create(user);
            }

            console.log(newUser);
            return newUser || false;
        } catch (e) {

        }
    },


    updateUser: function (userid, data) {
        return new Promise((resolve, reject) => {
            UserModal.updateOne(
                {
                    _id: new mongoose.Types.ObjectId(userid)
                },
                {
                    $set: data
                }
            ).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    getUserOrders: (userid) => {
        return new Promise((resolve, reject) => {
            OrdersModalDb.find({ user_id: userid }).then((orders) => {
                resolve(orders)
            }).catch((err) => {
                reject(err)
            })
        })
    },


    getWishListItems: (userid) => {
        return new Promise((resolve, reject) => {
            wishListModelDb.find({ user_id: userid }).then((wishlistItems) => {
                resolve(wishlistItems)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    deleteWishlist: (wishlist_id, user_id) => {
        return new Promise((resolve, reject) => {
            wishListModelDb.deleteOne({ user_id: user_id, _id: new mongoose.Types.ObjectId(user_id) }).then(() => {
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    },


    getAddressList: (user_id) => {
        return new Promise((resolve, reject) => {
            addressModelDB.find({ user_id }).then((address) => {
                resolve(address)
            }).catch((err) => {
                reject(err)
            })
        })
    },


    addAddress: function (address) {
        return new Promise((resolve, reject) => {
            new addressModelDB(address).save().then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    updateAddress: function (address, user_id, address_id) {
        return new Promise((resolve, reject) => {
            addressModelDB.updateOne({ _id: new mongoose.Types.ObjectId(address_id), user_id: new mongoose.Types.ObjectId(user_id) }, { $set: { address } }).then(() => {
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    },

    deleteAddress: function (address_id, user_id) {
        return new Promise((resolve, reject) => {
            addressModelDB.deleteOne({ _id: new mongoose.Types.ObjectId(address_id), user_id: new mongoose.Types.ObjectId(user_id) }).then(() => {
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    },


    profilePicUpdate: function (profileImage, user_id) {

        let profileName = "user_profile" + profileImage?.name

        return new Promise((resolve, reject) => {
            try {
                profileImage.mv("./public/images/userProfile/" + profileName, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        this.updateUser(user_id, { profile: profileName }).then(() => {
                            resolve()
                        }).catch((err) => {
                            reject(err)
                        })
                    }
                })
            } catch (e) {
                reject(e)
            }
        })

    }




}


module.exports = userHelperMethod