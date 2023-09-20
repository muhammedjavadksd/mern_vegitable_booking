
const express = require("express");
const router = express.Router();
const userController = require("../controller/userController")
const authMiddleWare = require("../middlewares/AuthMiddleWare")


//Auth Related
router.get("/token_validation:token", userController.tokenValidation)

router.post("/sign_up", userController.userSignUpPost)
router.post("/otp_validation", userController.otpValidation)
router.post("/login", userController.userLoginPost)
router.post("/forget_password", userController.forgetPassword)
router.post("/new_password", userController.resetPassword)
router.post("/validate_jwt", userController.validateJWT)
router.post("/re_generate_token", userController.reGenerateJWT)


//Wallet Related
router.get("/user_wallet", authMiddleWare.isValidUser, userController.getWalletHistory)

//Orders Related
router.get("/get_orders", authMiddleWare.isValidUser, userController.getOrders)
router.get("/get_single_order", authMiddleWare.isValidUser, userController.getSingleOrder)

//Profile Related
router.put("/update_profile", authMiddleWare.isValidUser, userController.profileRelated)
router.put('/update_profile_image',authMiddleWare.isValidUser ,  userController.profileImageUpdate);

//Wishlist related
router.get("/get_wishlist", authMiddleWare.isValidUser, userController.getWishlistItems)
router.delete("/delete_wishlist", authMiddleWare.isValidUser, userController.deleteWishlist)

//address related
router.get('/get_addresses',authMiddleWare.isValidUser ,  userController.getAddressList);
router.post('/add_addresses',authMiddleWare.isValidUser ,  userController.addAddress);
router.put('/edit_addresses',authMiddleWare.isValidUser ,  userController.editAddress);
router.delete('/delete_address',authMiddleWare.isValidUser ,  userController.deleteAddress);
router.get('/get_single_address',authMiddleWare.isValidUser ,  userController.getSingleAddress);

module.exports = router;