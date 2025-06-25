const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: Boolean, default: true },
    types: [
      {
        _id: false,
        companions: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    airline: { type: String, required: true },
    details: { type: String },
    mecca: {
      hotel: { type: String, required: true },
      days: { type: Number, required: true },
    },
    madinah: {
      hotel: { type: String, required: true },
      days: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
