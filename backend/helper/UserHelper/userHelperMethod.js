let emailConfig = require("../../config/emailConfig")
let nodeMailer = require("nodemailer");
let const_data = require("../../config/const");
let UserModal = require("../../modals/userModal");
const { default: mongoose } = require("mongoose");

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
        
        1. Click the following link to reset your password: <a href="https://${url}">Click here for reset password</a> <br>
         
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

        try {
            let newUser;
            if (user && user._id) {
                newUser = await UserModal.findByIdAndUpdate(
                    user._id,
                    { $set: user },
                    { new: true, upsert: true }
                );
            } else {
                user.otp_validity = Date.now() + 300000
                user.isOtpValidated = false;
                newUser = await UserModal.create(user);
            }

            console.log(newUser);
            return newUser || false;
        } catch (e) {
            return e;
        }
    }
}


module.exports = userHelperMethod