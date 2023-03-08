const Admin = require("../models/admin_schema");

const Product = require("../models/product_schema");
const User = require("../models/user_schema");
const  Order=require('../models/order_schema')
const Coupon=require('../models/coupon_Schema')
let session;

//admin login

const loadLogin = async (req, res) => {
  try {
    res.render("admin/admin_login", { layout: "admin_layout" });
  } catch (error) {
    console.log(error.message);
  }
};

//admin verification

const adminLog = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    let admindb = await Admin.findOne({ email: email });
    if (admindb) {
      if (password == admindb.password && email == admindb.email) {
        session = req.session;
        session.adminid = req.body.email;
        res.redirect("/admin/dashbord");
      } else {
        res.render("admin/admin_login", {
          adminerror: "wrong email or password",
          layout: "admin_layout",
        });
      }
    } else {
      res.render("admin/admin_login", {
        adminerror: "wrong email or password",
        layout: "admin_layout",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//admin homedisplay

const adminHome = async (req, res) => {
  try {
    res.render("admin/dashbord", { layout: "admin_layout" });
  } catch (error) {
    console.log(error.message);
  }
};

//admin logout

const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};






const userList = async (req, res, next) => {
  User.find({})
    .lean()
    .then((data) => {
      res.render("admin/userList", { layout: "admin_layout", data });
    })
    .catch((error) => {
      res.status(400).json({ messageError: error });
      res.render("admin/admin", { layout: "admin_layout" });
    });
};


const blockUser =async(req,res)=>{
  try {
    const id=req.query.id
    await User.updateOne({_id:id},{status:false})
   User.find({}).lean()
   .then((data)=>{
    res.render('admin/userList',{layout:"admin_layout",data})
   })
  } catch (error) {
    console.log(error.message);
  }
}


const unblockUser=async(req,res)=>{
  try {
    const id = req.query.id
    await User.updateOne({_id:id},{status:true})
    User.find({}).lean()
    .then((data)=>{
      res.render('admin/userList',{layout:"admin_layout",data})
    })
  } catch (error) {
    console.log(error.message);
  }
}



const orderList=async(req,res)=>{
try {  
 const orderfind= await Order.find({}).populate('products.productId').populate('userId').lean()
  console.log(orderfind);
  res.render('admin/orderList',{layout:"admin_layout",orderfind})
} catch (error) {
  console.log(error.message);
}
}





const vieworder =async(req,res)=>{
  try {
    const orderdt= await Order.findOne({_id:req.params.id},{}).populate('products.productId').lean()
    res.render('admin/viewOrder',{layout:"admin_layout",orderdt})
  } catch (error) {
   console.log(error.message); 
  }
}



const orderStatus=async(req,res)=>{
  try {
    const orderId=req.body.orderId
    const status=req.body.status
    const change= await Order.updateOne({_id:orderId},{$set:{status:status}})            
    if(change){
      res.json({success:true,status})
    }
  } catch (error) {
    console.log(error.messsage);
  }
}


const displayCoupon= async(req,res)=>{
  try {
    const couponfind= await Coupon.find({}).lean()
    res.render('admin/couponList',{couponfind,layout:'admin_layout'})
  } catch (error) {
    console.log(error.message);
  }
}



const addCoupon= async(req,res)=>{
  try {
    res.render('admin/addCoupon',{layout:'admin_layout'})
  } catch (error) {
    console.log(error.message);
  }
}


const insertCoupon=async(req,res)=>{
  try {
 const coupondt=req.body 
const coupons= new Coupon(coupondt)
coupons.save();
    res.redirect('/admin/addCoupon')
  } catch (error) {
    console.log(error.message);
  }
}






const blockCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    await Coupon.updateOne({ _id: id }, { status: false });
    Coupon.find({})
      .lean()
        res.render("admin/couponList", { layout: "admin_layout" });
  } catch (error) {
    console.log(error.message);
  }
};






const unblockCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    await Coupon.updateOne({ _id: id }, { status: true });
    Coupon.find({})
      .lean()
        res.render("admin/couponList", { layout: "admin_layout" });
  } catch (error) {
    console.log(error.message);
  }
};






const editCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Coupon.findById({ _id: id }).lean();
    if (data) {
      res.render("admin/couponEdit", {
        layout: "admin_layout",
        data, 
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};







const updateCoupon= async(req,res)=>{
  try {
    const id=req.params.id  
    await Coupon.updateOne({_id:id},
      {$set:{
        couponId:req.body.couponId,
        discount:req.body.discount,
        maxLimit:req.body.maxLimit,
        minPurchase:req.body.minPurchase,
        expDate:req.body.expDate,
    }})

   res.redirect('/admin/couponList')
  } catch (error) {
    console.log(error.message);
  }
}






module.exports = {
  adminLog,
  loadLogin,
  adminLogout,
  adminHome,
  userList,
  blockUser,
  unblockUser,
  orderList,
  vieworder,
  displayCoupon,
  addCoupon,
  insertCoupon,
  blockCoupon,
  unblockCoupon,
  editCoupon,
  updateCoupon,
  orderStatus
};
