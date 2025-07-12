const mongoose = require("mongoose");

const companionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pass_number: { type: String, required: true },
  pass_image: { type: String }, // Local file path
});
const customPlan = new mongoose.Schema(
  {
    mecca: {
      hotel: { type: String, required: true },
      days: { type: Number, required: true },
    },
    madinah: {
      hotel: { type: String, required: true },
      days: { type: Number, required: true },
    },
    airline: { type: String, required: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      // required: true,
    },
    customPlan: {
      type: customPlan,
      required: false,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pass_number: { type: String, required: true },
    pass_image: { type: String, default: null }, // Local file path
    visa: { type: String }, // Local file path
    companions: [companionSchema],
    paid: { type: Number, required: true },
    publicToken: { type: String, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
