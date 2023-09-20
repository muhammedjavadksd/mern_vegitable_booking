
const { Mongoose, default: mongoose } = require("mongoose");
let UserModel = require("../../modals/userModal")
let WalletModel = require("../../modals/WalletHistory");
const OrdersModalDb = require("../../modals/OrderModal");
const addressModelDB = require("../../modals/AddressModel");

let commonHelper = {
    findSingleUser: function (userid) {
        return new Promise((resolve, reject) => {
            UserModel.findById(userid).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    getUserWalletHistory: (userid) => {
        return new Promise((resolve, reject) => {
            WalletModel.find({ user_id: new mongoose.Types.ObjectId(userid) }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    getSingleOrder: (order_id) => {
        return new Promise((resolve, reject) => {
            OrdersModalDb.findOne({ order_id }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },

    getSingleAddress: function (address_id) {
        return new Promise((resolve, reject) => {
            addressModelDB.findOne({ _id: new mongoose.Types.ObjectId(address_id) }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }


}


module.exports = commonHelper;