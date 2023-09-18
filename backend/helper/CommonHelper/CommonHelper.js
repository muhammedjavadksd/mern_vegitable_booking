
let UserModel = require("../../modals/userModal")

let commonHelper = {
    findSingleUser: function (userid) {
        return new Promise((resolve, reject) => {
            UserModel.findById(userid).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}


module.exports=commonHelper;