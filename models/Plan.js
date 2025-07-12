const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: Boolean, default: true },
    types: {
      2: {
        price: { type: Number, required: true },
        _id: false,
      },
      3: {
        price: { type: Number, required: true },
        _id: false,
      },
      4: {
        price: { type: Number, required: true },
        _id: false,
      },
      5: {
        price: { type: Number, required: true },
        _id: false,
      },
    },
    airline: { type: String, required: true },
    mecca: {
      hotel: { type: String, required: true },
      days: { type: Number, required: true },
    },
    madinah: {
      hotel: { type: String, required: true },
      days: { type: Number, required: true },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
