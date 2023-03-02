var express = require('express');
var router_user = express.Router();
// var express = require('express');
// var router = express.Router();
const User=require('../models/user_schema')
const userController=require('../controller/usercontroller');
const { isLogin, isLogout } = require('../middlerware/auth');

const productController=require('../controller/productcontroller');






// const { render } = require('../app');
// const { userlogin } = require('../controller/userController');
// const app= require('../app')




/* GET home page. */
router_user.get('/', userController.loadHome)
router_user.get('/products', userController.loadshopCategory)

router_user.get('/categoryFilter/:id', userController.categoryFilter)

router_user.get('/login' ,isLogout,userController.loadUserLogin)
router_user.get('/register',isLogout,userController.loadUserRegister)
router_user.get('/otpVerify',isLogout,userController.otpVerify)

router_user.get('/forgotPass',isLogout,userController.mobileConfirm)
router_user.post('/otpGenerate',isLogout,userController.otpGenerate)
router_user.get('/otpForgotPass',isLogout,userController.OtpForgotPass)
router_user.post('/otpForgotVerifyPass',isLogout,userController.otpCompareForgotPass)
router_user.get('/otpForgotVerifyPass',isLogout,userController.loadForgotPassOtp)
router_user.get('/resetPass',isLogout,userController.loadResetPass)
router_user.post('/resetPassword',isLogout,userController.resetPassword)


// router_user.get('/products',userController.loadProducts)
router_user.get('/singleProduct',  userController.loadSingleProduct)
router_user.post('/userRegister',userController.doSignup)
router_user.post('/otpVerify',userController.otpCompare)
router_user.post('/login',userController.userLogin)

router_user.get('/logout' ,isLogin ,userController.userLogout)



router_user.get('/addToCart/:id' ,isLogin,userController.addToCart)
router_user.get('/cart',isLogin,userController.loadCart)
router_user.get('/deleteCart/:id' ,isLogin,userController.deletecart)


router_user.post('/changeqty',userController.changeqty)
// router_user.post('/changeqty/:id',userController.decqty)




router_user.get('/addToWishlisT/:id',isLogin,userController.addToWishlist)
router_user.get('/wishlist',isLogin,userController.loadWishlist)

router_user.get('/userProfile' ,isLogin,userController.userProfile)

router_user.get("/editUserProfile" ,isLogin,userController.editUserProfile)

router_user.post("/updateUserProfile/:id",userController.updateUserProfile)

router_user.get('/AddAddress' ,isLogin,userController.loadAddAddress)
router_user.post('/addAddress/:id',userController.addAddress)


router_user.get('/addressList',isLogin,userController.loadAddressList)
router_user.get('/editAddress/:id',isLogin,userController.loadEditAddress)
router_user.post('/updateAddress/:id',userController.updateAddress)
router_user.get('/deleteAddress/:id',isLogin,userController.deleteAddress)


router_user.get('/deletewish/:id',userController.deleteWish)
router_user.get('/UserProfile',isLogin,userController.userProfile)



router_user.get('/checkOut',isLogin,userController.checkOut)
router_user.post('/checkoutAddress',userController.checkoutaddress)

router_user.post('/orderConfirmation',userController.orderConfirmation)
router_user.get('/orderConfirmation',isLogin,userController.loadorderConfirmation)
router_user.get('/orderDetails',isLogin,userController.loadMyOrders)



router_user.get('/cancelOrder/:id',isLogin,userController.cancelOrder)
router_user.get('/orderDetails/:id',isLogin,userController.orderDetails)


router_user.post('/checkCoupon/:id',userController.applyCoupon)

module.exports = router_user;