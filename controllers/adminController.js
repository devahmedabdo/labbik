const User = require('../models/User');
const Booking = require('../models/Booking');
const Plan = require('../models/Plan');
const Issue = require('../models/Issue');

// 📊 Get Dashboard Stats
const getDashboardStats = async (req, res) => {
       const [
            users,
            pendingBookings,
            paidBookings,
            bookings,
            inActivePlans,
            plans,
            inActiveIssues,
            issues
        ] = await Promise.all([
            User.countDocuments(),
            Booking.countDocuments({ status: 'pending' }),
            Booking.countDocuments({ $expr: { $eq: ["$paid", "$total"] } }),
            Booking.countDocuments(),
            Plan.countDocuments({ status: false }),
            Plan.countDocuments(),
            Issue.countDocuments({ status: 'pending' }),
            Issue.countDocuments()
        ]);

        res.status(200).json({
            users,
            pendingBookings,
            paidBookings,
            bookings,
            inActivePlans,
            plans,
            inActiveIssues,
            issues
        });
 
} 

module.exports = { getDashboardStats };
