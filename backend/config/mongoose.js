
const mongoose = require("mongoose");




const connectToDB = function () { 
    mongoose.connect(process.env.MONGO_URI).then((data) => {
        console.log("Database connected", data.connection.host)
    }).catch((err) => {
        console.log("Database connection error",err);
        process.exit(1)
    })
}


module.exports = connectToDB;