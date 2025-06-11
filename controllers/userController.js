const User = require('../models/User');
const Booking = require('../models/Booking');
const Plan = require('../models/Plan');
const getData = require('../utils/queryBuilder');
const { sendEmail } = require('../utils/mail');
const bcrypt = require('bcrypt');
// 📊 Get Dashboard Stats
const getPlans = async (req, res) => {
  const plans = await Plan.find({status:true});
  res.status(200).send( plans);
};

const getBookings = async (req, res) => {
  const data = await getData(Booking,req.query,{creator:req.user._id})
  res.status(200).send( data);
};
const updateUser = async (req, res) => {
  const { name, email } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  ) 
  res.status(200).send({ message: 'User updated successfully' }) ;
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Old password is incorrect' });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.status(200).send({ message: 'Password updated successfully' });
};
// 🔐 Generate and email reset token
const resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const token = user.generateToken('1Hour');
  await sendEmail(user.email,process.env.URL+token)
  res.status(200).json({ message: 'Password reset email sent' });
};

module.exports = { getPlans ,getBookings,resetPassword,updateUser,updatePassword};
