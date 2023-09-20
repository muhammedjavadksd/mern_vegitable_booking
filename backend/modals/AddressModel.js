
const mongoose = require("mongoose");



let addressModel = new mongoose.Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    house_name: { type: String, required: true },
    city_town_dist: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: Number, required: true },
    landmark: { type: String, required: true },
    phone_number: { type: Number, required: true },
    email: { type: String, required: true },
    alternative_phone: { type: String, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true },
})

const addressModelDB = mongoose.model("address", addressModel)
module.exports = addressModelDB;