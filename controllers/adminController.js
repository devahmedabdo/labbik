const User = require('../models/User');
const Booking = require('../models/Booking');
const Plan = require('../models/Plan');

// 📊 Get Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalPlans = await Plan.countDocuments();

    const totalPaid = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$paid' } } }
    ]);

    res.json({
      totalUsers,
      totalBookings,
      totalPlans,
      totalPaid: totalPaid[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard stats', error: err.message });
  }
};

module.exports = { getDashboardStats };
