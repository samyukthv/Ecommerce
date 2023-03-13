const User = require("../models/user_schema");
const bcrypt = require("bcrypt");
const auth = require("../middlerware/auth");
const otpGenerator = require("otp-generator");
const accountSid = process.env.TWILIO_ID;
const authToken = process.env.TWILIO_TOKEN;

const client = require("twilio")(accountSid, authToken);
const productsCollection = require("../models/product_schema");
const { count, populate, findOne } = require("../models/user_schema");
const order = require("../models/order_schema");
const Banner = require('../models/banner_schema')
const Coupon = require("../models/coupon_Schema");
const { v4: uuidv4 } = require("uuid");
const category = require("../models/category_schema");
const Razorpay = require("razorpay");
var session;

var instance = new Razorpay({
  key_id: "rzp_test_JIiuMLMMvE8WDr",
  key_secret: "tTIQJkJw52gKqzn1iE0GLgBC",
});

const loadHome = async (req, res) => {
  try {
    if (req.session.userid) {
      const product = await productsCollection
        .find({ status: true })
        .limit(4)
        .lean();
      const productSkip = await productsCollection
        .find({ status: true })
        .skip(4)
        .limit(4)
        .lean();
      const fullProducts = await productsCollection
        .find({ status: true })
        .skip(5)
        .limit(5)
        .lean();
      const CouponFind = await Coupon.find({}).limit(5).lean();
      const banner = await Banner.find({status:true}).limit(5).lean();
      res.render("user/home", {
        userdata: req.session.userid,
        product,
        productSkip,
        fullProducts,
        CouponFind,
        banner
      });
    } else {
      const product = await productsCollection
        .find({ status: true })
        .limit(4)
        .lean();
      const productSkip = await productsCollection
        .find({ status: true })
        .skip(4)
        .limit(4)
        .lean();
      const fullProducts = await productsCollection
        .find({ status: true })
        .skip(5)
        .limit(5)
        .lean();
      const CouponFind = await Coupon.find({}).limit(5).lean();

      const banner = await Banner.find({status:true}).limit(5).lean();
      console.log(banner);

      res.render("user/home", {
        product,
        productSkip,
        fullProducts,
        CouponFind,
        banner
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadshopCategory = async (req, res) => {
  try {

    const pageNum = req.query.page;
    const perPage = 6;


    userdata = req.session.userid;

    const category1 = await category.find({}).lean();
    const product = await productsCollection
      .find({ status: true }).skip((pageNum - 1) * perPage).limit(perPage)
      .lean()
      .then((data) => {
        res.render("user/products", { data, userdata, category1 });
      });
  } catch (error) {
    console.log(error.message);
  }
};

const categoryFilter = async (req, res) => {
  try {
    const id = req.params.id;
    userdata = req.session.userid;
    const category1 = await category.find({}).lean();
    const product = await productsCollection
      .find({ status: true, categoryId: id })
      .populate("categoryId")
      .lean()
      .then((data) => {
        res.render("user/products", { data, userdata, category1 });
      });
  } catch (error) {
    console.log(error.message);
  }
};

const loadSingleProduct = async (req, res) => {
  try {
    userdata = req.session.userid;
    const id = req.params.id;
    const userfind = await User.findOne({ email: userdata });
    if (req.session.userid) {
      orderfind = await order
        .find({ "products.productId": id, userId: userfind._id })
        .populate("products.productId");
      const productrev = await productsCollection
        .findOne({ _id: id })
        .select("review")
        .lean(); // Select only the review array
      const reviews = productrev.review;
      const sproduct = await productsCollection
        .findById({ _id: id })
        .lean()
        .then((data) => {
          res.render("user/singleProduct", {
            data,
            userdata,
            orderfind,
            reviews,
          });
        });
    } else {
      const productrev = await productsCollection
        .findOne({ _id: id })
        .select("review")
        .lean(); // Select only the review array
      const reviews = productrev.review;
      const sproduct = await productsCollection
        .findById({ _id: id })
        .lean()
        .then((data) => {
          res.render("user/singleProduct", { data, userdata, reviews });
        });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const addReview = async (req, res) => {
  try {
    const userdata = req.session.userid;
    const id = req.params.id;
    review = req.body.review;
    userName = req.body.username;
    await productsCollection.updateOne(
      { _id: id },
      { $push: { review: { userName: userName, message: review } } }
    );
    res.redirect(`/singleProduct/${id}`);
  } catch (error) {
    console.log(error.message);
  }
};

const loadUserLogin = async (req, res) => {
  try {
    res.render("user/login");
  } catch (error) {
    console.log(error.message);
  }
};

const loadUserRegister = async (req, res) => {
  try {
    res.render("user/register");
  } catch (error) {
    console.log(error.message);
  }
};

const otpVerify = async (req, res) => {
  try {
    res.render("user/otpVerify");
  } catch (error) {
    console.log(error.message);
  }
};

//signup

const doSignup = async (req, res) => {
  try {
    const userdata = req.body;
    let userdb = await User.findOne({ email: userdata.email });
    if (userdb) {
      res.render("user/register", { userstatus: "email id already exist" });
    } else {
      req.session.userdata = req.body;

      const otpResponse = await client.verify.v2
        .services("VA46788dbe2dfeaeadd44acc1fc2e4c345")
        .verifications.create({
          to: `+91${userdata.mobile}`,
          channel: "sms",
        });

      res.redirect("/otpVerify");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//   otp comparing
const otpCompare = async (req, res) => {
  try {
    userdt = req.session.userdata;
    otp = req.body.otp;

    const verifiedResponse = await client.verify.v2
      .services("VA46788dbe2dfeaeadd44acc1fc2e4c345")
      .verificationChecks.create({
        to: `+91${userdt.mobile}`,
        code: otp,
      });
    if (verifiedResponse.status == "approved") {
      userdt.password = await bcrypt.hash(userdt.password, 10);
      const data = new User(userdt);
      data.save().then((data) => {
        session = req.session;
        session.userid = userdt.email;
        user = req.session.userid;
        res.redirect("/");
      });
    } else {
      res.render("user/otpVerify", {
        otpVal: "the otp you have entered is incorrect",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//display number confirmation page for forgot otp

const mobileConfirm = async (req, res) => {
  try {
    res.render("user/enterMobile");
  } catch (error) {
    console.log(error.message);
  }
};

//generate otp to reset password

const otpGenerate = async (req, res) => {
  try {
    usermob = req.body.mobile;
    let userdb = await User.findOne({ mobile: usermob });
    if (userdb) {
      const otpResponse = await client.verify.v2
        .services("VA46788dbe2dfeaeadd44acc1fc2e4c345")
        .verifications.create({
          to: `+91${usermob}`,
          channel: "sms",
        });
      res.render("user/otpForgotVerify", { usermob });
    } else {
      res.render("user/enterMobile", {
        userstatus: "Entered mobile number does not match",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//otp verification page render for forgot password

const OtpForgotPass = async (req, res) => {
  try {
    res.render("user/otpForgotVerify");
  } catch (error) {
    console.log(error.message);
  }
};

//otp verification for forgot password

const otpCompareForgotPass = async (req, res) => {
  try {
    userdt = req.body.mobile;
    otp = req.body.otp;
    const verifiedResponse = await client.verify.v2
      .services("VA46788dbe2dfeaeadd44acc1fc2e4c345")
      .verificationChecks.create({
        to: `+91${userdt}`,
        code: otp,
      });
    if (verifiedResponse.status == "approved") {
      res.redirect("/resetPass");
    } else {
      res.render("user/otpForgotVerify", {
        otpVal: "the otp you have entered is incorrect",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//load forgot password otp
const loadForgotPassOtp = async (req, res) => {
  try {
    res.render("user/loadOtpVerify");
  } catch (error) {
    console.log(error.message);
  }
};

// load resetPassword

const loadResetPass = async (req, res) => {
  try {
    userdt = req.session.userdata;
    res.render("user/resetPassword");
  } catch (error) {
    console.log(error.message);
  }
};

//reset password

const resetPassword = async (req, res) => {
  try {
    mobileNo = req.body.mobile;
    pass = req.body.password;
    pass = await bcrypt.hash(pass, 10);

    await User.updateOne({ mobile: mobileNo }, { $set: { password: pass } });
    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
};

//user login

const userLogin = async (req, res) => {
  userdata = req.body;
  let user = await User.findOne({ email: userdata.email });
  if (user) {
    bcrypt.compare(userdata.password, user.password).then((data) => {
      if (data) {
        session = req.session;
        session.userid = req.body.email;
        res.redirect("/");
      } else {
        console.log("fail 1");
        res.render("user/login", { logfail: "incorrect email or password" });
      }
    });
  } else {
    console.log("fail 2");
    res.render("user/login", { logfail: "incorrect email or password" });
  }
};

//user profile load

const userProfile = async (req, res) => {
  try {
    const userdata = req.session.userid;
    let userdt = await User.find({ email: userdata }).lean();
    res.render("user/userProfile", { userdt, userdata });
  } catch (error) {
    console.log(error.message);
  }
};

const editUserProfile = async (req, res) => {
  try {
    userdata = req.session.userid;
    let userdt = await User.find({ email: userdata }).lean();
    res.render("user/editProfile", { userdata, userdt });
  } catch (error) {
    console.log(error.message);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    userdata = req.session.userid;
    addressdt = {
      street: req.body.street,
      district: req.body.district,
      state: req.body.state,
      country: req.body.country,
      pincode: req.body.pincode,
    };
    id = req.body.id;
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          address: { ...addressdt },
        },
      }
    );
    res.redirect("/userProfile");
  } catch (error) {
    console.log(error.message);
  }
};

///////////////////////////////////////////////

const loadAddAddress = async (req, res) => {
  try {
    userdata = req.session.userid;
    let userdt = await User.find({ email: userdata }).lean();
    res.render("user/addAddress", { userdata, userdt });
  } catch (error) {
    console.log(error.message);
  }
};

const addAddress = async (req, res) => {
  try {
    id = req.params.id;
    let userdt = await User.find({ email: userdata });
    const addressdata = {
      street: req.body.street,
      district: req.body.district,
      state: req.body.state,
      country: req.body.country,
      pincode: req.body.pincode,
    };
    await User.updateOne(
      { _id: id },
      { $push: { address: { ...addressdata } } }
    );

    res.redirect("/userProfile");
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

const addToWishlist = async (req, res) => {
  try {
    if(req.session.userid){
      const userdata = req.session.userid;
      id = req.params.id;
      const user = await User.findOne({
        email: userdata,
        "wishlist.productdt": id,
      });
      if (user) {
        res.json({ message: "Product already in wishlist" });
        return;
      }
      await User.updateOne(
        { email: userdata },
        { $push: { wishlist: { productdt: req.params.id } } }
      );
      res.json({ message: "Product added to wishlist" });
    }else{
      res.json({message:"hello"})
     }
   
  } catch (error) {
    console.log(error.message);
  }
};

const loadWishlist = async (req, res) => {
  try {
    const userdata = req.session.userid;
    const wishfind = await User.findOne({ email: userdata })
      .populate("wishlist.productdt")
      .lean()
      .exec();
    res.render("user/wishlist", { userdata, wishfind });

    // if (wishfind.wishlist.length <= 0) {
    //   res.render("user/wishlist", {
    //     userdata,
    //     fill: "wishlist is empty please add products to whislist",
    //   });
    // }
  } catch (error) {
    console.log(error.message);
  }
};

const deleteWish = async (req, res) => {
  try {
    const userdata = req.session.userid;
    id = req.params.id;
    await User.updateOne(
      { email: userdata },
      { $pull: { wishlist: { productdt: id } } }
    );
    const wishfind = await User.findOne({ email: userdata })
      .populate("wishlist.productdt")
      .lean()
      .exec();
    res.render("user/wishlist", { userdata, wishfind });
  } catch (error) {
    console.log(error.message);
  }
};

const addToCart = async (req, res) => {
  try {
   if(req.session.userid){
    console.log("addddddddddddddddddddddddddddddddddddddddddddddddddddddd");
    const userdata = req.session.userid;

    if (userdata) {
      const id = req.params.id;
      const productdata = await productsCollection.findOne({ _id: id });
      // Check if the product is already in the cart for the user
      const user = await User.findOne({
        email: userdata,
        "cart.productid": id,
      });
      if (user) {
        res.json({ message: "Product already in cart" });
        return;
      }
      // Add product to cart
      await User.updateOne(
        { email: userdata },
        { $push: { cart: { productid: id } } }
      );
      const pPrice = productdata.price * 1;
      await User.updateOne(
        { email: userdata, "cart.productid": id },
        { $set: { "cart.$.total": pPrice } }
      );
      res.json({ message: "Product added to cart" });
    } else {
      res.json({ message: "Unauthorized" });
    
  } 
   }else{
    res.json({message:"hello"})
   }
      
  } catch (error) {
    console.log(error.message);

  }
};


const loadCart = async (req, res) => {
  try {
    const userdata = req.session.userid;
    const cartfind = await User.findOne({ email: userdata })
      .populate("cart.productid")
      .lean()
      .exec();
    let totalcart = 0;
    cartfind.cart.forEach((element) => {
      totalcart += element.total;
    });
    await User.updateOne(
      { email: userdata },
      { $set: { totalbill: totalcart } }
    );
    if (cartfind.cart.length <= 0) {
      res.render("user/cart", {
        userdata,
        fill: "cart is empty please fill the cart",
      });
    }
    res.render("user/cart", { userdata, cartfind, totalcart });
  } catch (error) {
    console.log(error.message);
  }
};

const deletecart = async (req, res) => {
  try {
    const userdata = req.session.userid;
    id = req.params.id;
    await User.updateOne(
      { email: userdata },
      { $pull: { cart: { productid: id } } }
    );
    res.redirect('/cart')
  } catch (error) {
    console.log(error.message);
  }
};

const changeqty = async (req, res) => {
  try {
    if (req.session.userid) {
      const userdata = req.session.userid;
      const count = req.body.count;
      const id = req.body.product;
      const price1 = req.body.price;
      const incr = await User.updateOne(
        { email: userdata, "cart.productid": id },
        { $inc: { "cart.$.quantity": count } }
      );
      const cartfind = await User.findOne(
        { email: userdata, "cart.productid": id },
        { "cart.$": 1 }
      );
      const proPrice = price1 * cartfind.cart[0].quantity;
      const realPrice = await User.updateOne(
        { email: userdata, "cart.productid": id },
        { $set: { "cart.$.total": proPrice } }
      );
      const cartFind = await User.findOne({ email: userdata }, { cart: 1 });
      const cartTotal = cartFind.cart.reduce((total1, item) => {
        return total1 + item.total;
      }, 0);
      await User.updateOne({ email: userdata }, { totalbill: cartTotal });
      res.json({ success: true, proPrice, cartTotal });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadAddressList = async (req, res) => {
  try {
    const userdata = req.session.userid;
    let userdt = await User.find({ email: userdata }).lean();
    res.render("user/addressList", { userdata, userdt });
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditAddress = async (req, res) => {
  try {
    const userdata = req.session.userid;
    const id = req.params.id;
    let user1 = await User.findOne({ email: userdata }).lean();
    let userdt = await User.findOne(
      { email: userdata, "address._id": id },
      { "address.$": 1 }
    ).lean();
    res.render("user/editAddress", { userdata, userdt, user1 });
  } catch (error) {
    console.log(error.message);
  }
};

const updateAddress = async (req, res) => {
  try {
    const userdata = req.session.userid;
    id = req.params.id;
    await User.updateOne(
      { email: userdata, "address._id": req.params.id },
      {
        $set: {
          "address.$": req.body,
        },
      }
    );
    res.redirect("/addressList");
  } catch (error) {
    console.log(error.message);
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userdata = req.session.userid;
    const id = req.params.id;
    await User.updateOne(
      { email: userdata, "address._id": id },
      { $pull: { address: { _id: id } } }
    );

    res.redirect("/addressList");
  } catch (error) {
    console.log(error.message);
  }
};



const checkoutaddress = async (req, res) => {
  try {
    const userdata = req.session.userid;
    let userdt = await User.find({ email: userdata });
    const addressdata = {
      street: req.body.street,
      district: req.body.district,
      state: req.body.state,
      country: req.body.country,
      pincode: req.body.pincode,
    };
    await User.updateOne(
      { email: userdata },
      { $push: { address: { ...addressdata } } }
    );

    res.redirect("/checkOut");
  } catch (error) {
    console.log(error.message);
  }
};

const toPayment = async (req, res) => {
  try {
    if (req.session.userid) {
      userdata = req.session.userid;
      const orderDetails = req.body;
      const productdt = [];
      orderDetails.products = productdt;

      if (!Array.isArray(orderDetails.productid)) {
        orderDetails.productid = [orderDetails.productid];
      }
      if (!Array.isArray(orderDetails.quantity)) {
        orderDetails.quantity = [orderDetails.quantity];
      }
      if (!Array.isArray(orderDetails.price)) {
        orderDetails.price = [orderDetails.price];
      }
      for (let i = 0; i < orderDetails.productid.length; i++) {
        const product1 = orderDetails.productid[i];
        const quantity = orderDetails.quantity[i];
        const total = orderDetails.price[i];
        productdt.push({
          productId: product1,
          quantity: quantity,
          singleTotal: total,
        });
      }

      const order_id = "order_id_";
      orderDetails.couponCode = req.body.coupon;
      orderDetails.discount = req.body.discount;
      orderDetails.total = orderDetails.total - req.body.discount;
      orderDetails.orderId = order_id + uuidv4();

      const orderdt = new order(orderDetails);
      orderdt.save();

      const userfind = await User.updateOne(
        { email: userdata },
        { $pull: { cart: {} } }
      );

      if (req.body.paymentType == "cash on delivery") {
        res.json({ codStatus: true });
      } else {
        let options = {
          amount: orderDetails.total * 100, // amount in the smallest currency unit
          currency: "INR",
          receipt: "" + orderdt._id,
        };
        instance.orders.create(options, function (err, order) {
          res.json(order);
        });
      }
    }
  } catch (error) {
    res.redirect("/checkOut");
  }
};

const orderConfirm = async (req, res) => {
  try {
    const userdata = req.session.userid;
    const latestOrder = await order
      .findOne({})
      .sort({ date: -1 })
      .populate("products.productId")
      .lean();
    res.render("user/orderConfirmation", { userdata, latestOrder });
  } catch (error) {
    console.log(error.message);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const latestOrder = await order
      .findOne({}, { _id: 1 })
      .sort({ date: -1 })
      .populate("products.productId")
      .lean();
    const latestOrderId = latestOrder._id.toString();
    const crypto = require("crypto");
    let hmac = crypto.createHmac("sha256", "tTIQJkJw52gKqzn1iE0GLgBC");
    hmac.update(
      req.body["response[razorpay_order_id]"] +
      "|" +
      req.body["response[razorpay_payment_id]"]
    );
    hmac = hmac.digest("hex");
    console.log(hmac == req.body["response[razorpay_signature]"]);
    if (hmac === req.body["response[razorpay_signature]"]) {
      console.log("payment succesdfull");
      await order.updateOne(
        { _id: latestOrderId },
        { $set: { status: "Placed" } }
      );
      res.json({ status: true });
    } else {
      console.log("payment failed");
      await order.updateOne(
        { _id: latestOrderId },
        { $set: { status: "Payment Failed" } }
      );
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadorderConfirmation = async (req, res) => {
  try {
    const userdata = req.session.userid;
    res.render("user/orderConfirmation", { userdata });
  } catch (error) {
    console.log(error.message);
  }
};

const loadMyOrders = async (req, res) => {
  try {
    const userdata = req.session.userid;
    let id = await User.findOne({ email: userdata }, { _id: 1 });
    let orders = await order
      .find({ userId: id })
      .populate("products.productId")
      .lean();

    let orderdt = await order
      .find({ userId: id }, {})
      .populate("products.productId")
      .lean();

    if (!Array.isArray(orderdt)) {
      orderdt = [orderdt];
    }
    res.render("user/myOrders", { userdata, orderdt, orders });
  } catch (error) { }
};

const cancelOrder = async (req, res) => {
  try {
    const userdata = req.session.userid;
    id = req.params.id;
    const orderdt = await order.findOne({ _id: id });

    if (orderdt.status == "pending") {
      await order.updateOne({ _id: id }, { $set: { status: "canceled" } });
    } else {
      res.redirect("/orderDetails");
    }

    res.redirect("/orderDetails");
  } catch (error) {
    console.log(error.message);
  }
};

const orderDetails = async (req, res) => {
  try {
    const userdata = req.session.userid;
    const id = req.params.id;

    const orderdt = await order
      .findOne({ _id: id }, {})
      .populate("products.productId")
      .lean();
    res.render("user/orderDetails", { orderdt, userdata });
  } catch (error) {
    console.log(error.message);
  }
};




const checkOut = async (req, res) => {
  try {
    const userdata = req.session.userid;
    const addressfind = await User.findOne(
      { email: userdata },
      { address: 1, _id: 0 }
    ).lean();

    const productfind = await User.findOne({ email: userdata })
      .populate("cart.productid")
      .lean();

    const result = await User.findOne({ email: userdata }, { _id: 1 }).lean();

    const id = result._id.toString();

    let subtotal = productfind.totalbill;

    // Define the flat rate shipping charge
    const shippingCharge = 50.0;

    // Calculate the total including shipping charge
    const total = subtotal + shippingCharge;

    res.render("user/checkout", {
      userdata,
      addressfind,
      productfind,
      total,
      id,
    });
  } catch (error) {
    console.log(error.message);
  }
};





const applyCoupon = async (req, res) => {
  try {
    let code = req.params.id;
    console.log(code);
    if (req.session.userid) {
      let userdata = req.session.userid;
      const userId = await User.findOne({ email: userdata }, {});

      let coupons = await Coupon.findOne({
        couponId: code,
        status: true,
      }).lean();
      if (coupons != null) {
        let today = new Date();
        if (coupons.expDate > today) {
          let userfind = await Coupon.findOne({couponId: code, user: userId._id }, {}).lean();

          let userID = userId._id;
          if (userfind == null) {
            let discount = coupons.discount;
            let discountPrice = Math.min(
              coupons.maxLimit,
              (userId.totalbill * discount) / 100
            );
            userId.totalbill = userId.totalbill - discountPrice;
            await userId.save();
            await Coupon.findOneAndUpdate(
              { couponId: code },
              { $push: { user: userId._id } }
            );
            res.json({ status: true, discountPrice });
            // let result = await Coupon.updateOne(
            //   { couponId: code },
            //   { $pull: { user: userId } }
            // );
            
          } else {
            res.json({ used: true });
            console.log("useddd");
          }
        } else {
          res.json({ expired: true });
        }
      } else {
        res.json({ noMatch: true });
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editCheckoutAddress = async (req, res) => {
  try {
    const userdata = req.session.userid;
    const id = req.params.id;

    let userdt = await User.findOne(
      { email: userdata, "address._id": id },
      { "address.$": 1 }
    ).lean();
    res.render("user/checkout", { userdata, userdt });
  } catch (error) {
    console.log(error.message);
  }
};







module.exports = {
  loadHome,
  loadUserLogin,
  loadUserRegister,
  doSignup,
  otpVerify,
  otpCompare,
  loadSingleProduct,
  loadshopCategory,
  userLogin,
  userLogout,
  loadCart,
  loadWishlist,
  addToCart,
  userProfile,
  editUserProfile,
  updateUserProfile,
  loadAddAddress,
  addAddress,
  loadAddressList,
  loadEditAddress,
  addToWishlist,
  deleteWish,
  updateAddress,
  deleteAddress,
  deletecart,
  changeqty,
  checkOut,
  checkoutaddress,
  toPayment,
  orderConfirm,
  verifyPayment,
  loadorderConfirmation,
  loadMyOrders,
  cancelOrder,
  orderDetails,
  applyCoupon,
  categoryFilter,
  mobileConfirm,
  otpGenerate,
  OtpForgotPass,
  otpCompareForgotPass,
  loadResetPass,
  resetPassword,
  loadForgotPassOtp,
  editCheckoutAddress,
  addReview,
};
