const Admin = require("../models/admin_schema");
const Category = require("../models/category_schema");

const Product = require("../models/product_schema");
const User = require("../models/user_schema");
const Order = require("../models/order_schema");
const Coupon = require("../models/coupon_Schema");
const pdfMake=require('pdfmake')
const exceljs=require('exceljs');
const Banner = require("../models/banner_schema");

let session;

//admin login

const loadLogin = async (req, res) => {
  try {
    res.render("admin/admin_login", );
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
    const totalOrders = await Order.countDocuments({});

    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: 0,
          total: { $sum: "$total" }, // Sum the total field of all documents
        },
      },
    ]);

    const totalUsers = await User.countDocuments({});
    console.log(totalUsers);


   const latest= await 
   Order.aggregate([
     {
       $unwind: "$products" // deconstruct the products array
     },
     {
       $group: {
         _id: "$products.productId",
         totalQuantity: { $sum: { $toInt: "$products.quantity" } } // sum the quantity of each product
       }
     },
     {
       $lookup: {
         from: "products", // name of the products collection
         localField: "_id",
         foreignField: "_id",
         as: "product"
       }
     },
     {
       $sort: { totalQuantity: -1 } // sort by the total quantity in descending order
     },
     {
       $limit: 5 // only return the top result
     },
     {
       $project: {
         _id: 0,
         productName: "$product.productName",
         totalQuantity: 1
       }
     }
   ])

console.log(latest);





const totalQuantities = latest.map(item => item.totalQuantity);
const productNames = latest.map(item => item.productName[0]);

console.log(totalQuantities); 
console.log(productNames);



 const result=await Order.aggregate([
  { $group: { _id: "$paymentType", count: { $sum: 1 } } },
])
    const paymentTypes = result.map((r) => r._id);
    const count = result.map((r) => r.count);
    console.log("Payment types:", paymentTypes);
    console.log("Counts:", count);
    const total = count.reduce((acc, curr) => acc + curr, 0);



    const pTotal = await Order.aggregate([
      {
        $group: {
          _id: "$paymentType",
          total: { $sum: "$total" },
        },
      },
    ]);
    console.log(pTotal);


const onlinePayment= await Order.aggregate([
  { $match: { paymentType: "onlinePayment" } },
  { $group: { _id:0, total: { $sum: "$total" } } }
])

console.log(onlinePayment);


const totalProducts = await Product.countDocuments({});

const totalCategories = await Category.countDocuments({});


const startOfToday = new Date().setHours(0,0,0,0); // get the start of today
const lastSevenDays = new Date(startOfToday - (7 * 24 * 60 * 60 * 1000)); // get the start of 7 days ago

const ordersPerDay = await Order.aggregate([
  {
    $match: {
      date: { $gte: lastSevenDays }
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
      count: { $sum: 1 }
    }
  },
  {
    $sort: {
      _id: 1
    }
  }
]);

const orderCounts = ordersPerDay.map(order => order.count);
console.log("countttttttttttttttttttttttttttttttttttt");
console.log(orderCounts); // will print an array of order counts for the last 7 days


 
 const ord=await Order.find().populate({
  path: 'products.productId',
  populate: {
      path: 'categoryId',
      model: Category
  }
})
const categoryCount = {};

ord.forEach(order => {
    order.products.forEach(product => {
        const category = product.productId.categoryId.categoryName;
        if (category in categoryCount) {
            categoryCount[category] += 1;
        } else {
            categoryCount[category] = 1;
        }
    });
});
// const sortedCategoryCount = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);

console.log(categoryCount);

const categoryCounts = Object.entries(categoryCount).map(([name, count]) => count);
const categoryNames = Object.entries(categoryCount).map(([name, count]) => name);
console.log(categoryNames);
console.log(categoryCounts);




console.log("heehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
console.log(paymentTypes);




    res.render("admin/dashbord", {
      layout: "admin_layout",
      totalOrders,
      totalSales,
      totalUsers,
      totalQuantities,
      
      productNames,
      count,total,pTotal,
      totalProducts,
      totalCategories,
      orderCounts,
      categoryCounts,
      categoryNames,paymentTypes
    
    });
  } catch (error) {
    console.log(error.message);
  }
};

//admin logout

const adminLogout = async (req, res) => {
  try {
    req.session.adminid=null;
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

const blockUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.updateOne({ _id: id }, { status: false });
    User.find({})
      .lean()
      .then((data) => {
        res.render("admin/userList", { layout: "admin_layout", data });
      });
  } catch (error) {
    console.log(error.message);
  }
};

const unblockUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.updateOne({ _id: id }, { status: true });
    User.find({})
      .lean()
      .then((data) => {
        res.render("admin/userList", { layout: "admin_layout", data });
      });
  } catch (error) {
    console.log(error.message);
  }
};

const orderList = async (req, res) => {
  try {
    const orderfind = await Order.find({})
      .populate("products.productId")
      .populate("userId")
      .lean();
    console.log(orderfind);
    res.render("admin/orderList", { layout: "admin_layout", orderfind });
  } catch (error) {
    console.log(error.message);
  }
};

const vieworder = async (req, res) => {
  try {
    const orderdt = await Order.findOne({ _id: req.params.id }, {})
      .populate("products.productId")
      .lean();
    res.render("admin/viewOrder", { layout: "admin_layout", orderdt });
  } catch (error) {
    console.log(error.message);
  }
};

const orderStatus = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const status = req.body.status;
    const change = await Order.updateOne(
      { _id: orderId },
      { $set: { status: status } }
    );
    if (change) {
      res.json({ success: true, status });
    }
  } catch (error) {
    console.log(error.messsage);
  }
};

const displayCoupon = async (req, res) => {
  try {
    const couponfind = await Coupon.find({}).lean();
    res.render("admin/couponList", { couponfind, layout: "admin_layout" });
  } catch (error) {
    console.log(error.message);
  }
};

const addCoupon = async (req, res) => {
  try {
    res.render("admin/addCoupon", { layout: "admin_layout" });
  } catch (error) {
    console.log(error.message);
  }
};

const insertCoupon = async (req, res) => {
  try {
    
    const coupondt = req.body;
    coupondt.couponId = coupondt.couponId
    .split(" ")
    .join(" ")
    .toUpperCase();
  let couponDb = await Coupon.findOne({
    couponId:coupondt.couponId,
  });
  console.log(couponDb);
  if (couponDb) {
    if (coupondt.couponId == couponDb.couponId) {
      res.render("admin/addCoupon", {
        layout: "admin_layout",
        couponStatus: "coupon already exist",
      });
    }
  }else{
    const coupons = new Coupon(coupondt);
    coupons.save();
    res.redirect("/admin/addCoupon");

  }

   
  } catch (error) {
    console.log(error.message);
  }
};

const blockCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    await Coupon.updateOne({ _id: id }, { status: false });
    Coupon.find({}).lean();
    res.render("admin/couponList", { layout: "admin_layout" });
  } catch (error) {
    console.log(error.message);
  }
};

const unblockCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    await Coupon.updateOne({ _id: id }, { status: true });
    Coupon.find({}).lean();
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

const updateCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    await Coupon.updateOne(
      { _id: id },
      {
        $set: {
          couponId: req.body.couponId,
          discount: req.body.discount,
          maxLimit: req.body.maxLimit,
          minPurchase: req.body.minPurchase,
          expDate: req.body.expDate,
        },
      }
    );

    res.redirect("/admin/couponList");
  } catch (error) {
    console.log(error.message);
  }
};







const loadSalesReport= async(req,res)=>{
  try {
    res.render('admin/salesReport',{layout:"admin_layout"})
  } catch (error) {
    console.log(error.message);
  }
}


const generateReport=async(req,res)=>{
  try {
    console.log("hello");
    
    const startDate=req.body.startDate;
    const endDate=req.body.endDate;
    console.log(startDate);
    console.log(endDate);


    const orders = await Order.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 'desc' }).populate("userId").lean()
    
console.log(orders);
   
     
    res.render('admin/salesReport',{layout:'admin_layout',orders,startDate,endDate})
  } catch (error) {
    console.log(error.message);
  }
}




const downloadPdf=async(req,res)=>{
  try {
    
   
    

  } catch (error) {
    console.log(error.message);
  }
}





const downloadExcel=async(req,res)=>{
  try {
    console.log("excellllllllllllllllllllllllllllllll");
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
   console.log(startDate);
   console.log(endDate);
   
   
   
   const orders = await Order.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(new Date(startDate).setHours(00,00,00)),
          $lte: new Date(new Date(endDate).setHours(00,00,00)),
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
      },
    },
    {
      $project: {
        _id: 0,
        orderId: 1,
        total: 1,
        username: "$user.firstname",
        paymentType: 1,
        status: 1,
      },
    },
  ]);

  // const orders = await Order.aggregate([
  //   {
  //     $match: {
  //       date: { $gte: startDate, $lte: endDate }
  //     }
  //   },
   
  // ]);
  
   
  console.log(orders);



  const workbook = new exceljs.Workbook();
    
  // Add a new worksheet to the workbook
  const worksheet = workbook.addWorksheet('Sales Report');

  // Add headers to the worksheet
  worksheet.addRow(['Order ID', 'Total bill', 'Customer Name', 'Payment Type', 'Order Status']);

  // Add data to the worksheet
  for (const order of orders) {
    worksheet.addRow([order.orderId,order.total, order.username, order.paymentType, order.status]);
  }


 // Set the response headers and filename
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="sales-report.xlsx"`);
    
      // Write the workbook to the response stream
      await workbook.xlsx.write(res);
    
      // End the response stream
      res.end();

  } catch (error) {
    console.log(error.message);
  }
}



const loadAddBanner=async(req,res)=>{
  try {
    res.render('admin/addBanner',{layout:"admin_layout"})
  } catch (error) {
    console.log(error.message);
  }
}






const addNewBanner = async (req, res, next) => {
  const banner = req.body;
  console.log("bannerererererer");
  console.log(banner);
  console.log("banererererereer");
  console.log(req.file)
  
  banner.image = req.file.filename;
  const data = new Banner(banner);
    data.save();
    res.render("admin/addBanner", { layout: "admin_layout" });
  
};




const listBanner = async (req, res, next) => {
  Banner.find({})
    .lean()
    .then((data) => {
      res.render("admin/bannerList", { layout: "admin_layout", data });
    })
    .catch((error) => {
      res.status(400).json({ messageError: error });
      res.render("admin/admin", { layout: "admin_layout" });
    });
};







const editBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Banner.findById({ _id: id }).lean();
    if (data) {
      res.render("admin/editBanner", { layout: "admin_layout", data });
    }
  } catch (error) {
    console.log(error.message);
  }
};





const updateBanner = async (req, res) => {
  const banner = req.body;
  
    try {
      if(req.file){
        await Banner.updateOne(
          { _id: req.body.id },
          {
            $set: {
              name: req.body.name,
              description: req.body.description,
             
              image: req.file.filename,
            },
          }
        );
      }else{await Banner.updateOne(
        { _id: req.body.id },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
           
           
          },
        }
      );}
        

     
      
      // await Banner.find({})
      //   .lean()
      //   .then((data) => {
      //     res.render("admin/bannerList", { layout: "admin_layout", data });
      //   });

res.redirect('/admin/bannerList')

    } catch (error) {
      console.log(error.message);
    
  }
};




const blockBanner = async (req, res) => {
  try {
    const id = req.params.id;
    await Banner.updateOne({ _id: id }, { status: false });
    Banner.find({})
      .lean()
        res.render("admin/BannerList", { layout: "admin_layout" });
  } catch (error) {
    console.log(error.message);
  }
};







const unblockBanner = async (req, res) => {
  try {
    const id = req.params.id;
    await Banner.updateOne({ _id: id }, { status: true });
    Banner.find({})
      .lean()
        res.render("admin/BannerList", { layout: "admin_layout" });
  } catch (error) {
    console.log(error.message);
  }
};





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
  orderStatus,
  loadSalesReport,
  generateReport,
  downloadPdf,
  downloadExcel,
  loadAddBanner,
 
  addNewBanner,
  listBanner,
  editBanner,
  
  
  updateBanner,
  unblockBanner,
  blockBanner
};
