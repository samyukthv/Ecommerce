var express = require('express');
// const app=require('../index')
//const { adminLog, loadLogin, adminHome, adminLogout,  userList, blockUser, unblockUser, orderList, vieworder, displayCoupon, addCoupon, insertCoupon,  blockCoupon, unblockCoupon, editCoupon, updateCoupon, orderStatus, loadSalesReport, generateReport, downloadPdf, downloadExcel, loadAddBanner, addNewBanner, listBanner, editBanner, updateBanner, blockBanner, unblockBanner } = require('../controller/adminController');
const upload= require('../multer')
var admin_router = express.Router();
const adminAuth=require('../middlerware/adminAuth');
 const adminController=require('../controller/admincontroller')
const productController=require('../controller/productcontroller')

const categoryController =require('../controller/categorycontroller')






admin_router.get('/',adminAuth.isLogout,adminController.loadLogin)
admin_router.post('/log',adminController.adminLog)
admin_router.get('/log',adminAuth.isLogout,adminController.loadLogin)
admin_router.get('/adminHome',adminAuth.isLogin, adminController.adminHome)
admin_router.get('/out',adminAuth.isLogin,adminController.adminLogout)
 admin_router.get('/dashbord',adminAuth.isLogin,adminController.adminHome)
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

admin_router.get('/blockCoupon/:id',adminAuth.isLogin,adminController.blockCoupon)
admin_router.get('/unblockCoupon/:id',adminAuth.isLogin,adminController.unblockCoupon)

admin_router.get('/editProduct' ,adminAuth.isLogin,productController.editProduct)
admin_router.get('/editCoupon/:id',adminAuth.isLogin,adminController.editCoupon)
admin_router.post('/updateCoupon/:id',adminAuth.isLogin,adminController.updateCoupon)

admin_router.post('/updateProduct/:id',upload.array('images',3),productController.updateProduct)


admin_router.get('/userList',adminAuth.isLogin,adminController.userList)
admin_router.get('/blockUser',adminController.blockUser)
admin_router.get('/unblockUser',adminController.unblockUser)



admin_router.get('/orderList',adminAuth.isLogin,adminController.orderList)
admin_router.get('/viewOrder/:id', adminAuth.isLogin,adminController.vieworder)


 admin_router.get('/couponList',adminAuth.isLogin,adminController.displayCoupon)
 admin_router.get('/addCoupon',adminAuth.isLogin,adminController.addCoupon)

 admin_router.post('/addCoupon',adminAuth.isLogin,adminController.insertCoupon)

 admin_router.post('/orderStatus',adminAuth.isLogin,adminController.orderStatus)

admin_router.get('/salesReport',adminAuth.isLogin,adminController.loadSalesReport)
admin_router.post('/generateReport',adminAuth.isLogin,adminController.generateReport)
 
admin_router.get('/downloadPdf',adminAuth.isLogin,adminController.downloadPdf)
admin_router.get('/downloadExcel',adminAuth.isLogin,adminController.downloadExcel)

admin_router.get('/addBanner',adminAuth.isLogin,adminController.loadAddBanner)


admin_router.post('/addNewBanner',upload.single('image'),adminController.addNewBanner)
admin_router.get('/bannerList', adminAuth.isLogin,adminController.listBanner)
admin_router.get('/editBanner/:id',adminAuth.isLogin,adminController.editBanner)
admin_router.post('/updateBanner',upload.single('image'),adminController.updateBanner)
admin_router.get('/blockBanner/:id',adminAuth.isLogin,adminController.blockBanner)
admin_router.get('/unblockBanner/:id',adminAuth.isLogin,adminController.unblockBanner)


module.exports =admin_router;














