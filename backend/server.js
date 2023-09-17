
const express = require("express");
const app = express();
const env = require("dotenv")
const dbConnection = require("./config/mongoose");
const adminRouter = require("./router/adminRouter")
const userRouter = require("./router/userRouter")
const cors = require("cors")
let logger = require("morgan")

env.config({ path: "../.env" })
dbConnection()

app.use(logger("combined"))
app.use(cors({
    origin: "http://localhost:7000",
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let port = process.env.BACK_END_PORT || 7000;
console.log(process.env.MONGO_URI)

app.use("/", userRouter);
app.use("/admin", adminRouter)


app.listen(7000, () => {
    console.log("Server started at port 7000")
})