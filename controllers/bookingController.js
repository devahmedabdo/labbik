const Booking = require("../models/Booking");
const Log = require("../models/Log");
const fs = require("fs");
const path = require("path");
const getData = require("../utils/queryBuilder");
const { deleteLocalFile } = require("../middlewares/uploadMiddleware");
 
const getBookings = async (req, res) => {
  try {
    const data = await getData(Booking, req.query, { user: req.user._id });
    console.log(data);
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const createBooking = async (req, res) => {
  try {
    const { name, phone, address, pass_number, plan, paid, total } = req.body;

    const mainImage = req.files["pass_image"]?.[0];
    const pass_image = mainImage ? `${req.protocol}://${req.get("host")}/uploads/${mainImage.filename}` : "";
    const companions = req.body?.companions?.map((companion, i) => {
      const imageFile = req.files[`companions[${i}][pass_image]`]?.[0];
      return {
        ...companion,
        pass_image: imageFile ? `${req.protocol}://${req.get("host")}/uploads/${imageFile.filename}` : "",
      };
    });

    const newBooking = await Booking.create({
      name,
      phone,
      address,
      pass_number,
      plan,
      paid,
      total,
      pass_image,
      companions,
      user: req.user._id,
    });

    await Log.create({
      user: req.user._id,
      action: `Created booking for ${name}`,
    });

    res.status(201).json({
      message: "Booking created successfully",
      newBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this booking." });
    }
    const { name = booking.name, phone = booking.phone, address = booking.address, pass_number = booking.pass_number, plan = booking.plan, paid = booking.paid, total = booking.total } = req.body;

    // Replace main pass image if new file sent
    let pass_image = booking.pass_image;
    const mainImage = req.files["pass_image"]?.[0];
    if (mainImage) {
      deleteLocalFile(pass_image);
      pass_image = `${req.protocol}://${req.get("host")}/uploads/${mainImage.filename}`;
    }

    // Companions
    const incomingCompanions = req.body?.companions;
    const updatedCompanions = [];
    const newCompanions = [];

    for (let i = 0; i < incomingCompanions.length; i++) {
      const comp = incomingCompanions[i];
      const imageFile = req.files?.[`companions[${i}][pass_image]`]?.[0];

      if (comp._id) {
        // Update existing
        const existing = booking.companions.find((c) => c._id.toString() === comp._id);
        if (existing) {
          if (imageFile) {
            deleteLocalFile(existing.pass_image);
            existing.pass_image = `${req.protocol}://${req.get("host")}/uploads/${imageFile.filename}`;
          }
          existing.name = comp.name || existing.name;
          existing.phone = comp.phone || existing.phone;
          existing.address = comp.address || existing.address;
          existing.pass_number = comp.pass_number || existing.pass_number;
          updatedCompanions.push(existing);
        }
      } else {
        // Add new
        newCompanions.push({
          name: comp.name,
          phone: comp.phone,
          address: comp.address,
          pass_number: comp.pass_number,
          pass_image: imageFile ? `${req.protocol}://${req.get("host")}/uploads/${imageFile.filename}` : "",
        });
      }
    }

    // Update booking
    booking.name = name;
    booking.phone = phone;
    booking.address = address;
    booking.pass_number = pass_number;
    booking.plan = plan;
    booking.paid = paid;
    booking.total = total;
    booking.pass_image = pass_image;
    booking.companions = [...updatedCompanions, ...newCompanions];
    booking.status = booking.visa ? 'completed':'pending'
    await booking.save();

    await Log.create({
      user: req.user._id,
      action: `Updated booking for ${booking.name}`,
    });

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateVisa = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this booking." });
    }
    let visa = booking.visa;
    const mainImage = req.files["visa"]?.[0];
    if (mainImage) {
      deleteLocalFile(visa);
      visa = `${req.protocol}://${req.get("host")}/uploads/${mainImage.filename}`;
      booking.visa = visa
      booking.status = visa ? 'completed':'pending'
    }
    await booking.save();
    await Log.create({
      user: req.user._id,
      booking: booking._id,
      action: `تم تعديل التاشيرة`,
    });

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: You do not own this booking." });
    }
    // Delete main image
    if (booking.pass_image) {
      deleteLocalFile(booking.pass_image);
    }
    if (booking.visa) {
      deleteLocalFile(booking.visa);
    }
    // Delete companion images
    if (Array.isArray(booking.companions)) {
      for (const comp of booking.companions) {
        if (comp.pass_image) {
          deleteLocalFile(comp.pass_image);
        }
      }
    }

    // Delete the booking itself
    await Booking.findByIdAndDelete(req.params.id);

    await Log.create({
      user: req.user._id,
      action: `Deleted booking for ${booking.name}`,
    });

    res.status(200).json({ message: "Booking and related images deleted successfully" });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createBooking,
  updateBooking,
  getBookings,
  deleteBooking,updateVisa
};
