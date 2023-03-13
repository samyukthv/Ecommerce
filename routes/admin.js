var express = require('express');
const app=require('../index')
const { adminLog, loadLogin, adminHome, adminLogout,  userList, blockUser, unblockUser, orderList, viewDetails, vieworder, displayCoupon, addCoupon, insertCoupon, deleteCoupon, blockCoupon, unblockCoupon, editCoupon, updateCoupon, orderStatus, loadSalesReport, generateReport, downloadPdf, downloadExcel, loadAddBanner, loadBannerList, addNewBanner, listBanner, editBanner, updateBanner, blockBanner, unblockBanner } = require('../controller/adminController');
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

admin_router.get('/blockCoupon/:id',adminAuth.isLogin,blockCoupon)
admin_router.get('/unblockCoupon/:id',adminAuth.isLogin,unblockCoupon)


admin_router.get('/editProduct' ,adminAuth.isLogin,productController.editProduct)
admin_router.get('/editCoupon/:id',adminAuth.isLogin,editCoupon)
admin_router.post('/updateCoupon/:id',adminAuth.isLogin,updateCoupon)

admin_router.post('/updateProduct/:id',upload.array('images',3),productController.updateProduct)


admin_router.get('/userList',adminAuth.isLogin,userList)
admin_router.get('/blockUser',blockUser)
admin_router.get('/unblockUser',unblockUser)



admin_router.get('/orderList',adminAuth.isLogin,orderList)
admin_router.get('/viewOrder/:id', adminAuth.isLogin,vieworder)


 admin_router.get('/couponList',adminAuth.isLogin,displayCoupon)
 admin_router.get('/addCoupon',adminAuth.isLogin,addCoupon)

 admin_router.post('/addCoupon',adminAuth.isLogin,insertCoupon)

 admin_router.post('/orderStatus',adminAuth.isLogin,orderStatus)

admin_router.get('/salesReport',adminAuth.isLogin,loadSalesReport)
admin_router.post('/generateReport',adminAuth.isLogin,generateReport)
 
admin_router.get('/downloadPdf',adminAuth.isLogin,downloadPdf)
admin_router.get('/downloadExcel',adminAuth.isLogin,downloadExcel)

admin_router.get('/addBanner',adminAuth.isLogin,loadAddBanner)


admin_router.post('/addNewBanner',upload.single('image'),addNewBanner)
admin_router.get('/bannerList', adminAuth.isLogin,listBanner)
admin_router.get('/editBanner/:id',adminAuth.isLogin,editBanner)
admin_router.post('/updateBanner',upload.single('image'),updateBanner)
admin_router.get('/blockBanner/:id',adminAuth.isLogin,blockBanner)
admin_router.get('/unblockBanner/:id',adminAuth.isLogin,unblockBanner)


module.exports =admin_router;














