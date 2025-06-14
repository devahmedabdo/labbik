const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    action: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
