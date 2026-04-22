const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema(
  {
    trackingId: { type: String, unique: true, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    weight: { type: Number, required: true },
    parcelType: {
      type: String,
      enum: ["document", "package", "fragile", "electronics"],
      default: "package",
    },
    cost: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "picked", "in-transit", "out-for-delivery", "delivered", "cancelled"],
      default: "pending",
    },
    assignedCourier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    estimatedDelivery: { type: Date },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    trackingHistory: [
      {
        status: String,
        location: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parcel", parcelSchema);
