const express = require('express');
const router = express.Router();
const {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan
} = require('../controllers/planController');

const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getPlans)        // Public
  .post(protect, admin, createPlan); // Admin only

router.route('/:id')
  .put(protect, admin, updatePlan)
  .delete(protect, admin, deletePlan);

module.exports = router;
