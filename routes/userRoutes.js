const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { createBooking, updateBooking, deleteBooking, getBookings, updateVisa, getBookingDetails, clinetBookingDetails } = require("../controllers/bookingController");
const { updateUser } = require("../controllers/userController");
const { upload } = require("../middlewares/uploadMiddleware");
// const { createPlan, updatePlan, deletePlan, getUserPlans } = require("../controllers/planController");

const companionFields = Array.from({ length: 10 }).map((_, i) => ({
  name: `companions[${i}][pass_image]`,
  maxCount: 1,
}));
const companionVisaFields = Array.from({ length: 10 }).map((_, i) => ({  name: `companions[${i}][visa]`,  maxCount: 1,}))
router.use(protect);
// router.post("/plans", createPlan);
// router.get("/plans", getUserPlans);
// router.delete("/plans/:id", deletePlan);
// router.patch("/plans/:id", updatePlan);

router.post("/bookings", upload.fields([{ name: "pass_image", maxCount: 1 }, ...companionFields]), createBooking);
router.patch("/bookings/:id", upload.fields([{ name: "pass_image", maxCount: 1 }, ...companionFields]), updateBooking);
router.put("/bookings/:id", upload.fields([{ name: "visa", maxCount: 1 },...companionVisaFields]), updateVisa);
router.delete("/bookings/:id", deleteBooking);
router.get("/booking/:id", getBookingDetails);
router.get("/bookings", getBookings);
router.get("/bookings/client/:token", clinetBookingDetails);

router.patch("/", updateUser);

module.exports = router;
