var express = require('express');
var router_user = express.Router();
// var express = require('express');
// var router = express.Router();
const User=require('../models/user_schema')
const userController=require('../controller/usercontroller');
const { isLogin, isLogout } = require('../middlerware/auth');
const block=require('../middlerware/block')
const productController=require('../controller/productcontroller');






// const { render } = require('../app');
// const { userlogin } = require('../controller/userController');
// const app= require('../app')




/* GET home page. */
router_user.get('/',block.ifBlocked, userController.loadHome)
router_user.get('/products',block.ifBlocked, userController.loadProducts)

router_user.post('/search',block.ifBlocked, userController.loadProducts)

router_user.get('/categoryFilter/:id',block.ifBlocked, userController.categoryFilter)
router_user.get('/highLow',block.ifBlocked, userController.highLow)
router_user.get('/lowHigh',block.ifBlocked, userController.lowHigh)

router_user.post('/search',block.ifBlocked, userController.categoryFilter)
router_user.post('/search',block.ifBlocked, userController.highLow)
router_user.post('/search',block.ifBlocked, userController.lowHigh)




router_user.get('/login' ,block.ifBlocked, isLogout,userController.loadUserLogin)
router_user.get('/register',block.ifBlocked, isLogout,userController.loadUserRegister)
router_user.get('/otpVerify',block.ifBlocked, isLogout,userController.otpVerify)

router_user.get('/forgotPass',block.ifBlocked, isLogout,userController.mobileConfirm)
router_user.post('/otpGenerate', block.ifBlocked,isLogout,userController.otpGenerate)
router_user.get('/otpForgotPass', block.ifBlocked,isLogout,userController.OtpForgotPass)
router_user.post('/otpForgotVerifyPass',block.ifBlocked,isLogout,userController.otpCompareForgotPass)
router_user.get('/otpForgotVerifyPass',block.ifBlocked,isLogout,userController.loadForgotPassOtp)
router_user.get('/resetPass',block.ifBlocked,isLogout,userController.loadResetPass)
router_user.post('/resetPassword',block.ifBlocked,isLogout,userController.resetPassword)


// router_user.get('/products',userController.loadProducts)
router_user.get('/singleProduct/:id',block.ifBlocked,  userController.loadSingleProduct)
router_user.post('/userRegister',block.ifBlocked,userController.doSignup)
router_user.post('/otpVerify',block.ifBlocked,userController.otpCompare)
router_user.post('/login',block.ifBlocked,userController.userLogin)

router_user.get('/logout' ,block.ifBlocked,isLogin ,userController.userLogout)



router_user.get('/addToCart/:id' ,block.ifBlocked,userController.addToCart)
router_user.get('/cart',isLogin,block.ifBlocked,userController.loadCart)
router_user.get('/deleteCart/:id' ,block.ifBlocked,isLogin,userController.deletecart)


router_user.post('/changeqty',block.ifBlocked,userController.changeqty)
// router_user.post('/changeqty/:id',userController.decqty)




router_user.get('/addToWishlisT/:id',block.ifBlocked,userController.addToWishlist)
router_user.get('/wishlist',block.ifBlocked,isLogin,userController.loadWishlist)

router_user.get('/userProfile' ,block.ifBlocked,isLogin,userController.userProfile)

router_user.get("/editUserProfile" ,block.ifBlocked,isLogin,userController.editUserProfile)

router_user.post("/updateUserProfile/:id",userController.updateUserProfile)

router_user.get('/AddAddress' ,block.ifBlocked,isLogin,userController.loadAddAddress)
router_user.post('/addAddress/:id',userController.addAddress)


router_user.get('/addressList',block.ifBlocked,isLogin,userController.loadAddressList)
router_user.get('/editAddress/:id',block.ifBlocked,isLogin,userController.loadEditAddress)
router_user.post('/updateAddress/:id',block.ifBlocked,userController.updateAddress)
router_user.get('/deleteAddress/:id',block.ifBlocked,isLogin,userController.deleteAddress)


router_user.get('/deletewish/:id',block.ifBlocked,userController.deleteWish)
router_user.get('/UserProfile',block.ifBlocked,isLogin,userController.userProfile)



router_user.get('/checkOut',block.ifBlocked,isLogin,userController.checkOut)
router_user.post('/checkoutAddress',isLogin,userController.checkoutaddress)



router_user.post('/placeOrder',isLogin,userController.toPayment)
router_user.get('/orderConfirmed',block.ifBlocked,isLogin,userController.orderConfirm)



router_user.post('/verifyPayment',block.ifBlocked,isLogin,userController.verifyPayment)


router_user.get('/orderConfirmation',block.ifBlocked,isLogin,userController.loadorderConfirmation)
router_user.get('/orderDetails',block.ifBlocked,isLogin,userController.loadMyOrders)



router_user.get('/cancelOrder/:id',block.ifBlocked,isLogin,userController.cancelOrder)

router_user.get('/returnOrder/:id',block.ifBlocked,isLogin,userController.returnOrder)
router_user.get('/orderDetails/:id',block.ifBlocked,isLogin,userController.orderDetails)


router_user.post('/checkCoupon/:id',isLogin,userController.applyCoupon)

router_user.post('/cancelCoupon/:code',block.ifBlocked,isLogin,userController.cancelCoupon)

router_user.get('/cCoupon',block.ifBlocked,isLogin,userController.cCoupon)



router_user.get('/editCheckoutAddress/:id',block.ifBlocked,isLogin,userController.editCheckoutAddress)

router_user.post('/addReview/:id',isLogin,userController.addReview)



router_user.get('/SomeThingWentWrong',block.ifBlocked,isLogin,userController.wentWrong)

module.exports = router_user;