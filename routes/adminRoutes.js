const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  createUser,
  getAllUsers,
  deleteUser,updateUser
} = require('../controllers/admin/userAdminController');
// const { getDashboardStats } = require('../controllers/adminController');
const { getAllBookings } = require('../controllers/admin/bookingAdminController');
const { getLogs ,deleteBulkLogs, deleteLog} = require('../controllers/logController');
const { createPlan, getPlans,updatePlan,deletePlan } = require('../controllers/planController');

// All routes below require admin access

router.use(protect, adminOnly);
// 📌 User management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// 📌 Plan management
router.post('/plans', createPlan);
router.get('/plans', getPlans);
router.delete('/plans/:id', deletePlan);
router.patch('/plans/:id', updatePlan);

// 📌 Booking overview (all users)
router.get('/bookings', getAllBookings);

// 📌 Logs (with pagination/filtering)
router.get('/logs', getLogs);
router.delete('/log/:id', deleteLog);
router.delete('/logs/bulk', deleteBulkLogs);

// // Admin Dashboard
// router.get('/dashboard', getDashboardStats);
module.exports = router;
