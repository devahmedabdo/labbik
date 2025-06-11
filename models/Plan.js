const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type:Boolean, default:true },
    types: [
      {
        companions: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
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
