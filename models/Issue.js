const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    phone: { type: String, required: true },
    details: { type: String, required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
