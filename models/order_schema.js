const mongoose = require("mongoose");

const Product = require("../models/product_schema");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: String,
    
    required: true,
   // generate a custom order ID using uuid
  },
  deliveryAddress: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: String,
      singleTotal: Number,
    },
  ],
  total: {
    type: Number,
  },
  paymentType: {
    type: String,
  },
  couponCode: {
    type: String,
  },
  discount: {
    type: Number,
  },
  status: {
    type: String,
    default: "Placed",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
