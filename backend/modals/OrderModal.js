

const mongoose = require("mongoose");


let orderModel = new mongoose.Schema({
    order_id: { type: String, required: true },
    order_date: { type: Date, required: true },
    shipper_name: { type: String, required: true },
    total: { type: String, required: true },
    status: { type: String, required: true },
    address: { type: Object, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true },
    invoice_id: { type: mongoose.Types.ObjectId, required: true },
    products: [{
        product_id: { type:  mongoose.Types.ObjectId, required: true },
        quantity: Number
    }]
})

const OrdersModalDb = mongoose.model("orders", orderModel)
module.exports = OrdersModalDb;