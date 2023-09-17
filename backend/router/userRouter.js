
const express = require("express");
const router = express.Router();
const userController = require("../controller/userController")

//GET METHOD
router.get("/token_validation:token", userController.tokenValidation)


//POST METHOD
router.post("/sign_up", userController.userSignUpPost)
router.post("/otp_validation", userController.otpValidation)
router.post("/login", userController.userLoginPost)
router.post("/forget_password", userController.forgetPassword)
router.post("/new_password", userController.resetPassword)

router.post("/validate_jwt", userController.validateJWT)
router.post("/re_generate_token", userController.reGenerateJWT)


module.exports = router;