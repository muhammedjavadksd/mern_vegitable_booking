

const mongoose = require("mongoose");


let wishListModal = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },
    product_id: { type: mongoose.Types.ObjectId, required: true }
})

const wishListModelDb = mongoose.model("wishlist", wishListModal)
module.exports = wishListModelDb;