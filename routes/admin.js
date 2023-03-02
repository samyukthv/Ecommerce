var express = require('express');
const app=require('../index')
const { adminLog, loadLogin, adminHome, adminLogout,  userList, blockUser, unblockUser, orderList, viewDetails, vieworder, displayCoupon, addCoupon, insertCoupon, deleteCoupon } = require('../controller/adminController');
const upload= require('../multer')
var admin_router = express.Router();
const adminAuth=require('../middlerware/adminAuth');

const productController=require('../controller/productcontroller')

const categoryController =require('../controller/categorycontroller')






admin_router.get('/',adminAuth.isLogout, loadLogin)
admin_router.post('/log',adminLog)
admin_router.get('/log',adminAuth.isLogout,loadLogin)
admin_router.get('/adminHome',adminAuth.isLogin, adminHome)
admin_router.get('/out',adminAuth.isLogin,adminLogout)
 admin_router.get('/dashbord',adminAuth.isLogin,adminHome)
//admin_router.get('/productList',loadProductList)


admin_router.get('/categoryList', adminAuth.isLogin,categoryController.listCategory)
admin_router.get('/addCategory', adminAuth.isLogin,categoryController.loadAddCategory)
 admin_router.post('/addNewCategory',upload.single('image'),categoryController.addNewCategory)
 
// admin_router.post('/addNewCategory',upload.array('image',1),addNewCategory)
 admin_router.get('/editCategory',adminAuth.isLogin,categoryController.editCategory)
admin_router.post('/updateCategory',upload.single('image'),categoryController.updateCategory)
admin_router.get('/deleteCategory/:id',adminAuth.isLogin,categoryController.deleteCategory)
 admin_router.post('/addProduct', upload.array('images',3), productController.addProduct)
admin_router.get('/addProduct',adminAuth.isLogin,productController.loadAddProduct)
admin_router.get('/productList',adminAuth.isLogin,productController.listProduct)
admin_router.get('/blockProduct/:id',adminAuth.isLogin,productController.blockProduct)
admin_router.get('/unblockProduct/:id',adminAuth.isLogin,productController.unblockProduct)
admin_router.get('/editProduct' ,adminAuth.isLogin,productController.editProduct)


admin_router.post('/updateProduct/:id',upload.array('images',3),productController.updateProduct)


admin_router.get('/userList',adminAuth.isLogin,userList)
admin_router.get('/blockUser',blockUser)
admin_router.get('/unblockUser',unblockUser)



admin_router.get('/orderList',adminAuth.isLogin,orderList)
admin_router.get('/viewOrder/:id', adminAuth.isLogin,vieworder)


 admin_router.get('/couponList',adminAuth.isLogin,displayCoupon)
 admin_router.get('/addCoupon',adminAuth.isLogin,addCoupon)

 admin_router.post('/addCoupon',insertCoupon)

 admin_router.get('/deleteCoupon/:id',deleteCoupon)



 

module.exports =admin_router;














