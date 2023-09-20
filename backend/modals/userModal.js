

const mongoose = require("mongoose");


let UserModal = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    telegram_id: String,
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    profile_pic: String,
    password: String,
    status: String,
    is_suspended: Boolean,
    otp: Number,
    isOtpValidated: Boolean,
    otp_validity: Number,
    last_login: Date,
    number_orders_placed: {
        type: Number,
        default: 0
    },
    wallet_amount: {
        type: Number,
        default: 0
    },
    total_wallet_credit: {
        type: Number,
        default: 0
    },
    last_wallet_update: {
        type: String,
        default: ""
    },
    profile: String,
    total_used: Number,
    total_credit: Number,
    refresh_token: String,
    access_token: String,
    token: String,
    tokenExpire: Number,
})

const UserModalDb = mongoose.model("users", UserModal)

module.exports = UserModalDb;