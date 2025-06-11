const Booking = require('../models/Booking');
const Log = require('../models/Log');
const fs = require('fs');
const path = require('path');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (user)
const createBooking = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      pass_number,
      plan,
      paid,
      total,
      companion
    } = req.body;

    const passImage = req.files['pass_image']?.[0]?.path;
    const companionData = JSON.parse(companion || '[]');

    const companions = companionData.map((c, i) => ({
      ...c,
      pass_image: req.files['companion_pass_images']?.[i]?.path || ''
    }));

    const newBooking = await Booking.create({
      name,
      phone,
      address,
      pass_number,
      plan,
      pass_image: passImage,
      companion: companions,
      paid,
      total,
      user: req.user._id,
      status: passImage ? 'completed' : 'pending'
    });

    await Log.create({
      user: req.user._id,
      action: `Created booking for ${name}`
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private (user)
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const {
      name,
      phone,
      address,
      pass_number,
      plan,
      paid,
      total,
      companion
    } = req.body;

    // Handle passport image
    let newPassImage = booking.pass_image;
    const newImage = req.files['pass_image']?.[0];
    if (newImage) {
      if (booking.pass_image && fs.existsSync(booking.pass_image)) {
        fs.unlinkSync(booking.pass_image);
      }
      newPassImage = newImage.path;
    }

    // Handle companions
    const companions = JSON.parse(companion || '[]');
    const newCompanions = companions.map((c, i) => {
      const imageFile = req.files['companion_pass_images']?.[i];
      let newImagePath = c.pass_image;

      if (imageFile) {
        const old = booking.companion?.[i]?.pass_image;
        if (old && fs.existsSync(old)) {
          fs.unlinkSync(old);
        }
        newImagePath = imageFile.path;
      }

      return { ...c, pass_image: newImagePath };
    });

    // Update booking
    booking.name = name;
    booking.phone = phone;
    booking.address = address;
    booking.pass_number = pass_number;
    booking.plan = plan;
    booking.pass_image = newPassImage;
    booking.companion = newCompanions;
    booking.paid = paid;
    booking.total = total;
    booking.status = newPassImage ? 'completed' : 'pending';

    await booking.save();

    await Log.create({
      user: req.user._id,
      action: `Updated booking ${booking.name}`
    });

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update booking' });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (user)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Delete images
    if (booking.pass_image && fs.existsSync(booking.pass_image)) {
      fs.unlinkSync(booking.pass_image);
    }

    booking.companion.forEach(c => {
      if (c.pass_image && fs.existsSync(c.pass_image)) {
        fs.unlinkSync(c.pass_image);
      }
    });

    await booking.deleteOne();

    await Log.create({
      user: req.user._id,
      action: `Deleted booking ${booking.name}`
    });

    res.json({ message: 'Booking deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
};

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking
};
