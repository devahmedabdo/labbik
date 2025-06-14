const express = require("express");
const router = express.Router();
const { protect,   } = require("../middlewares/authMiddleware");
const { createBooking,updateBooking,deleteBooking, getBookings ,updateVisa} = require("../controllers/bookingController");
const { updateUser } = require("../controllers/userController");
const {upload} = require("../middlewares/uploadMiddleware");

const companionFields = Array.from({ length: 10 }).map((_, i) => ({
  name: `companions[${i}][pass_image]`,
  maxCount: 1,
}));

router.post("/bookings",protect,  upload.fields([{ name: "pass_image", maxCount: 1 }, ...companionFields]), createBooking);
router.patch("/bookings/:id",protect,  upload.fields([{ name: "pass_image", maxCount: 1 }, ...companionFields]), updateBooking);
router.put("/bookings/:id",protect,  upload.fields([{ name: "visa", maxCount: 1 } ]), updateVisa);
router.delete("/bookings/:id",protect,   deleteBooking);
router.get("/bookings", protect, getBookings);

router.patch("/", protect, updateUser);


module.exports = router;
