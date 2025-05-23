// models/OrderSchema.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;
const orderSchema = new Schema({
  customer: {
    type: String,
    required: false,
  },
  user_uuid: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: String,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true,
        min: 1,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "PKR",
  },
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  paymentDetails: {
    paymentIntentId: { type: String, required: false },
    customerId: { type: String, required: false },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the 'updatedAt' field before each save
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const OrderSchema = model("Order", orderSchema);

export default OrderSchema;
