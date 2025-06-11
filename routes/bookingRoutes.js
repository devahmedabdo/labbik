const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { createBooking, updateBooking, deleteBooking } = require("../controllers/bookingController");

router.post(
  "/",
  protect,
  upload.fields([
    { name: "pass_image", maxCount: 1 },
    { name: "companion_pass_images", maxCount: 10 },
  ]),
  createBooking
);

// ...

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "pass_image", maxCount: 1 },
    { name: "companion_pass_images", maxCount: 10 },
  ]),
  updateBooking
);

router.delete("/:id", protect, deleteBooking);

module.exports = router;
