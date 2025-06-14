const express = require("express");
const router = express.Router();
const { getSelectPlans } = require("../controllers/planController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/select", protect, getSelectPlans);

module.exports = router;
