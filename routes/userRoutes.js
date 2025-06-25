const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { createBooking, updateBooking, deleteBooking, getBookings, updateVisa, getBookingDetails } = require("../controllers/bookingController");
const { updateUser } = require("../controllers/userController");
const { upload } = require("../middlewares/uploadMiddleware");
const { createPlan, updatePlan, getPlans, deletePlan } = require("../controllers/planController");

const companionFields = Array.from({ length: 10 }).map((_, i) => ({
  name: `companions[${i}][pass_image]`,
  maxCount: 1,
}));
router.use(protect);
router.post("/plans", createPlan);
router.get("/plans", getPlans);
router.delete("/plans/:id", deletePlan);
router.patch("/plans/:id", updatePlan);

router.post("/bookings", upload.fields([{ name: "pass_image", maxCount: 1 }, ...companionFields]), createBooking);
router.patch("/bookings/:id", upload.fields([{ name: "pass_image", maxCount: 1 }, ...companionFields]), updateBooking);
router.put("/bookings/:id", upload.fields([{ name: "visa", maxCount: 1 }]), updateVisa);
router.delete("/bookings/:id", deleteBooking);
router.get("/booking/:id", getBookingDetails);
router.get("/bookings", getBookings);

router.patch("/", updateUser);

module.exports = router;
