

const mongoose = require("mongoose");


let UserModal = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    mobile: {
        type: String,
        require: true,
    },
    telegram_id: String,
    first_name: {
        type: String,
        require: true,
    },
    last_name: {
        type: String,
        require: true,
    },
    profile_pic: String,
    password: String,
    status: String,
    is_suspended: Boolean,
    otp: Number,
    isOtpValidated: Boolean,
    otp_validity: Number,
    last_login: Date,
    number_orders_placed: Number,
    wallet_amount: Number,
    total_used: Number,
    total_credit: Number,
    refresh_token: String,
    access_token: String,
    token: String,
    tokenExpire: Number
})

const UserModalDb = mongoose.model("users", UserModal)

module.exports = UserModalDb;