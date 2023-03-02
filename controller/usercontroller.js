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
const Coupon = require("../models/coupon_Schema");
const { v4: uuidv4 } = require("uuid");
const category = require("../models/category_schema");
const Razorpay = require("razorpay");
var session;

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const loadHome = async (req, res) => {
  try {
    if (req.session.userid) {
      res.render("user/home", { userdata: req.session.userid });
    } else {
      res.render("user/home");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadshopCategory = async (req, res) => {
  try {
    userdata = req.session.userid;
    const category1 = await category.find({}).lean();
    const product = await productsCollection
      .find({ status: true })
      .lean()
      .then((data) => {
        res.render("user/products", { data, userdata, category1 });
        console.log(data);
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
        console.log(data);
      });
  } catch (error) {
    console.log(error.message);
  }
};

const loadSingleProduct = async (req, res) => {
  try {
    userdata = req.session.userid;
    const id = req.query.id;
    console.log(userdata);
    await productsCollection
      .findById({ _id: id })

      .lean()
      .then((data) => {
        console.log(data);
        res.render("user/singleProduct", { data, userdata });
      });
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
    console.log(userdata);
    let userdb = await User.findOne({ email: userdata.email });
    console.log(userdb);
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

const mobileConfirm = async(req,res)=>{
  try {
    res.render('user/enterMobile')
  } catch (error) {
    console.log(error.message);
  }
}




//generate otp to reset password


const otpGenerate = async (req, res) => {
  try {
     usermob = req.body.mobile;
    console.log(usermob+"generateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    let userdb = await User.findOne({ mobile: usermob });
    console.log(userdb);
    if (userdb) {
      // req.session.usermob = req.body.mobile;
      
      const otpResponse = await client.verify.v2
        .services("VA46788dbe2dfeaeadd44acc1fc2e4c345")
        .verifications.create({
          to: `+91${usermob}`,
          channel: "sms",
        });
     console.log("hyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
        res.render("user/otpForgotVerify",{usermob});
    } else {
      res.render("user/enterMobile", { userstatus: "Entered mobile number does not match" });
    }
  } catch (error) {
    console.log(error.message);
  }
};


//otp verification page render for forgot password


const OtpForgotPass= async(req,res)=>{
  try {
   console.log("otppppppppppppppppppppppppppppppppppp");
    res.render("user/otpForgotVerify");
  } catch (error) {
    console.log(error.message);
  }
}


//otp verification for forgot password  

const otpCompareForgotPass= async (req, res) => {
  try {

    console.log("compareeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
     userdt = req.body.mobile;

    // console.log(req.session.userdata);
    otp = req.body.otp;
      console.log(userdt+"userdttttttttttttttttttttttttttttttttttttttt");
    const verifiedResponse = await client.verify.v2
      .services("VA46788dbe2dfeaeadd44acc1fc2e4c345")
      .verificationChecks.create({
        to: `+91${userdt}`,
        code: otp,
      });
    if (verifiedResponse.status == "approved") {
      // userdt.password = await bcrypt.hash(userdt.password, 10);
      // const data = new User(userdt);
      // data.save().then((data) => {
      //   session = req.session;
      //   session.userid = userdt.email;
      //   user = req.session.userid;

      //   res.redirect("/");
      // });

        res.redirect('/resetPass')


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
 const loadForgotPassOtp= async(req,res)=>{
  try {
    console.log("hellellelelelleleleelelellllooo");
    res.render('user/loadOtpVerify')
  } catch (error) {
    console.log(error.message);
  }
 }

// load resetPassword


const loadResetPass=async(req,res)=>{
  try {
    userdt=req.session.userdata;
    res.render('user/resetPassword')
  } catch (error) {
    console.log(error.message);
  }
}


//reset password

const resetPassword=async(req,res)=>{
  try {

    // userdt = req.session.userdata;
    // console.log(userdt+"mobileeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    mobileNo=req.body.mobile
     pass = req.body.password
     console.log(pass);
     pass= await bcrypt.hash(pass, 10);

     await User.updateOne({mobile:mobileNo},{$set:{password:pass}})
       res.redirect('/login')
  } catch (error) {
    console.log(error.message);
  }
}


//user login

const userLogin = async (req, res) => {
  userdata = req.body;

  let user = await User.findOne({ email: userdata.email });
  console.log(userdata);
  if (user) {
    bcrypt.compare(userdata.password, user.password).then((data) => {
      console.log(data);

      if (data) {
        // console.log("success")
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
    console.log(1212111232323232242432423);
    console.log(userdt);
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
    console.log(id);
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          mobile: req.body.mobile,
          email: req.body.email,
          address: { ...addressdt },
        },
      }
    );

    console.log(addressdt);

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
    const userdata = req.session.userid;
    console.log(userdata + "addddddddddddddtoooooooooooowhishlist");
    id = req.params.id;
    console.log(id + "wishlistiddddddddddddddddddddddddd");

    const user = await User.findOne({
      email: userdata,
      "wishlist.productdt": id,
    });

    if (user) {
      res.redirect("/products");
      return;
    }

    await User.updateOne(
      { email: userdata },
      { $push: { wishlist: { productdt: req.params.id } } }
    );
    res.redirect("/products");
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
    userdata = req.session.userid;
    console.log(userdata);
    id = req.params.id;
    console.log(req.params.id);
    // userdt= await User.find({email:userdata})
    productdata = await productsCollection.findOne({ _id: id });
    console.log(productdata);

    // Check if the product is already in the cart for the user
    const user = await User.findOne({ email: userdata, "cart.productid": id });
    if (user) {
      res.redirect("/products");
      return;
    }
    ///add to cart

    await User.updateOne(
      { email: userdata },
      { $push: { cart: { productid: id } } }
    );

    const pPrice = productdata.price * 1;
    console.log(pPrice);

    const hy = await User.updateOne(
      { email: userdata, "cart.productid": id },
      { $set: { "cart.$.total": pPrice } }
    );

    console.log(hy);

    res.redirect("/products");
  } catch (error) {
    console.log(error.message);
  }
};

const loadCart = async (req, res) => {
  try {
    const userdata = req.session.userid;
    console.log(userdata);

    const cartfind = await User.findOne({ email: userdata })
      .populate("cart.productid")
      .lean()
      .exec();

    let totalcart = 0;
    cartfind.cart.forEach((element) => {
      totalcart += element.total;
    });
    console.log(totalcart);

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

    res.redirect("/cart");
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
      console.log(req.body);

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
      console.log(cartTotal);

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
    // let user1= await User.findOne({email:userdata}).lean()
    let userdt = await User.findOne(
      { email: userdata, "address._id": id },
      { "address.$": 1 }
    ).lean();
    console.log(userdt);
    // console.log(user1);

    res.render("user/editAddress", { userdata, userdt });
  } catch (error) {
    console.log(error.message);
  }
};

const updateAddress = async (req, res) => {
  try {
    const userdata = req.session.userid;

    id = req.params.id;

    console.log(
      id + "updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    );
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
    console.log(id + "deleteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    await User.updateOne(
      { email: userdata, "address._id": id },
      { $pull: { address: { _id: id } } }
    );

    res.redirect("/addressList");
  } catch (error) {
    console.log(error.message);
  }
};

const checkOut = async (req, res) => {
  try {
    const userdata = req.session.userid;
    console.log(
      userdata + "hyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
    );
    const addressfind = await User.findOne(
      { email: userdata },
      { address: 1, _id: 0 }
    ).lean();
    //  console.log(addressfind);

    const productfind = await User.findOne({ email: userdata })
      .populate("cart.productid")
      .lean();

    const result = await User.findOne({ email: userdata }, { _id: 1 }).lean();
    // console.log(result._id);
    //  const idArray = [result._id];
    //  console.log(idArray);

    const id = result._id.toString();
    console.log(id);

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

const checkoutaddress = async (req, res) => {
  try {
    console.log("addresssssssssssssssssssssssssssssssssssssss");
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

const orderConfirmation = async (req, res) => {
  try {
    if (req.session.userid) {
      console.log("ordeerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
      userdata = req.session.userid;
      const orderDetails = req.body;
      console.log(userdata + "emailllllllllllllllllllllllllllllllllll");

      // console.log(req.body);
      const productdt = [];
      console.log(req.body);
      console.log("bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
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
      console.log("couponnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
      console.log(req.body.coupon);
      console.log(req.body.discount);

      orderDetails.couponCode = req.body.coupon;
      orderDetails.discount = req.body.discount;
      orderDetails.total = orderDetails.total - req.body.discount;
      orderDetails.orderId = order_id + uuidv4();

      const orderdt = new order(orderDetails);
      orderdt.save();
      // console.log(orderdt._id + "orderiddddddddddddddddddddddddddddddddddddd");

      // if (req.body.paymentType == "cash on delivery") {
      //   res.json({ status: true });
      // } else {
      //   console.log("elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

      //   let options = {
      //     amount: newOrder.total * 100, // amount in the smallest currency unit
      //     currency: "INR",
      //     receipt: "" + orderdt._id,
      //   };
      //   instance.orders.create(options, function (err, order) {
      //     // console.log(order);
      //     res.json(order);
      //   });
      // }

      const userfind = await User.updateOne(
        { email: userdata },
        { $pull: { cart: { productid: { $in: orderDetails.productid } } } }
      );
      const latestOrder = await order
        .findOne({})
        .sort({ date: -1 })
        .populate("products.productId")
        .lean();
      console.log(latestOrder);

      res.render("user/orderConfirmation", { userdata, latestOrder });
    }
  } catch (error) {
    res.redirect("/checkOut");
  }
};


const verifyPayment = async (req, res) => {
  try {
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
    console.log(userdata);
    let id = await User.findOne({ email: userdata }, { _id: 1 });
    console.log(id);

    console.log(
      "hiiiiiiiiiihihihiihhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
    );
    let orderdt = await order
      .find({ userId: id }, {})
      .populate("products.productId")
      .lean();
    console.log("listtttttttttttttttttttttttttttttttt");
    console.log(orderdt);

    // if(orderdt.status=='canceled'){

    //   if(!Array.isArray(orderdt)) {
    //     orderdt = [orderdt];
    //    }
    // res.render('user/myOrders',{userdata,orderdt,canceled:'this order is already canceled'})

    // }
    if (!Array.isArray(orderdt)) {
      orderdt = [orderdt];
    }
    res.render("user/myOrders", { userdata, orderdt });
  } catch (error) {
    console.log(error.message);
  }
};

const cancelOrder = async (req, res) => {
  try {
    console.log("cancellllllllllllllllllllllllllllllllllllllll");
    const userdata = req.session.userid;
    id = req.params.id;
    console.log(id);
    const orderdt= await order.findOne({_id:id})
      
     if(orderdt.status=='pending'){
      await order.updateOne({ _id: id }, { $set: { status: "canceled" } });
     } else{
      res.redirect('/orderDetails')
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
    console.log(orderdt);
    res.render("user/orderDetails", { orderdt, userdata });
  } catch (error) {
    console.log(error.message);
  }
};

const applyCoupon = async (req, res) => {
  try {
    console.log("reacheddddddddddddddddddddddddddddddddddddddddd");
    let code = req.params.id;
    if (req.session.userid) {
      let userdata = req.session.userid;
      console.log(code);
      const userId = await User.findOne({ email: userdata }, {});
      console.log(userId._id);
      // checking if code is valid or not
      let coupons = await Coupon.findOne({
        couponId: code,
        status: true,
      }).lean();
      console.log(coupons);
      if (coupons != null) {
        console.log("there is match");
        let today = new Date();
        if (coupons.expDate > today) {
          let userfind = await Coupon.findOne({ user: userId._id }, {}).lean();

          let userID = userId._id;
          console.log(userID);
          console.log(userfind);
          if (userfind == null) {
            // let userCart = await cartSchema.findOne({ userId })
            let discount = coupons.discount;
            console.log(discount);
            console.log(userId.totalbill + "helllloooooooooooooooooooooo");
            // let discountPrice = (userId.totalbill * discount/ 100) ;
            let discountPrice = Math.min(
              coupons.maxLimit,
              (userId.totalbill * discount) / 100
            );
            // discountPrice = Math.round(discountPrice);
            console.log(discountPrice);
            userId.totalbill = userId.totalbill - discountPrice;
            console.log(userId.totalbill);
            await userId.save();
            await Coupon.findOneAndUpdate(
              { couponId: code },
              { $push: { user: userId._id } }
            );
            res.json({ status: true, discountPrice });
          } else {
            res.json({ used: true });
            console.log("useddd");
          }
        } else {
          console.log("expiredddddddddddd");
          res.json({ expired: true });
        }
      } else {
        console.log("heyy itss nooo mattcchhhh");
        res.json({ noMatch: true });
      }
    } else {
      res.redirect("/login");
    }
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
  orderConfirmation,
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
  loadForgotPassOtp
};
