const mongoose = require("mongoose");


let walletModel = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    payment_id: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    via: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
})


let ModalWallet = mongoose.model("wallet_history", walletModel, "wallet_history");
module.exports = ModalWallet;