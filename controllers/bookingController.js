const Booking = require("../models/Booking");
const Log = require("../models/Log");
const getData = require("../utils/queryBuilder");
const { deleteLocalFile } = require("../middlewares/uploadMiddleware");
const { nanoid } = require("nanoid");

const getBookings = async (req, res) => {
  const data = await getData(Booking, req.query, { user: req.user._id }, [
    { name: "user", form: "users", select: ["name", "email"] },
    { name: "plan", form: "plans", select: ["name","mecca","madinah","airline"] },
  ]);
  res.status(200).send(data);
};
const getBookingDetails = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "الحجز غير موجود" });
  if (booking.user.toString() !== req.user._id.toString() && req.user.role != "admin") {
    return res.status(403).json({ message: "ليس لديك صلاحية لعرض هذا المحتوي" });
  }
  await booking.populate("user", "name email _id");
  res.status(200).send(booking);
};
const clinetBookingDetails = async (req, res) => {
  console.log(req.params);
  const booking = await Booking.findOne({ publicToken: req.params.token });
  await booking.populate("plan user");
  if (!booking) return res.status(404).send({ message: "الحجز غير موجود" });

  // أرسل فقط البيانات التي تريد العميل يراها
  res.send(booking);
};
const getAllBookings = async (req, res) => {
  const data = await getData(Booking, req.query, {}, [
    { name: "user", form: "users", select: ["name", "email"] },
    { name: "plan", form: "plans", select: ["name","mecca","madinah","airline"] },
  ]);
  res.status(200).send(data);
};

const createBooking = async (req, res) => {
  const { name, phone, address, pass_number, plan, paid, total, customPlan } = req.body;
  const mainImage = req.files["pass_image"]?.[0];
  const pass_image = mainImage ? `/uploads/${mainImage.filename}` : "";
  const companions = req.body?.companions?.map((companion, i) => {
    const imageFile = req.files[`companions[${i}][pass_image]`]?.[0];
    return {
      ...companion,
      pass_image: imageFile ? `/uploads/${imageFile.filename}` : "",
    };
  });
  const publicToken = nanoid(16);
  const newBooking = await Booking.create({
    name,
    phone,
    address,
    pass_number,
    plan,
    customPlan: customPlan,
    paid,
    total,
    pass_image,
    companions,
    publicToken,
    user: req.user._id,
  });

  await Log.create({
    user: req.user._id,
    booking: newBooking._id,
    action: `حجز جديد`,
  });
  res.status(201).send(newBooking);
};
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "الحجز غير موجود" });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role != "admin") {
      return res.status(403).json({ message: "ليس لديك صلاحية لعرض هذا المحتوي" });
    }
    const {
      name = booking.name,
      customPlan = booking.customPlan,
      phone = booking.phone,
      address = booking.address,
      pass_number = booking.pass_number,
      plan = booking.plan,
      paid = booking.paid,
      total = booking.total,
    } = req.body;

    // Replace main pass image if new file sent customPlan
    let pass_image = booking.pass_image;
    const mainImage = req.files["pass_image"]?.[0];
    if (mainImage) {
      deleteLocalFile(pass_image);
      pass_image = `/uploads/${mainImage.filename}`;
    }

    // Companions
    const incomingCompanions = req.body?.companions;
    const updatedCompanions = [];
    const newCompanions = [];
    console.log(incomingCompanions);
    for (let i = 0; i < incomingCompanions?.length; i++) {
      const comp = incomingCompanions[i];
      const imageFile = req.files?.[`companions[${i}][pass_image]`]?.[0];

      if (comp._id) {
        // Update existing
        const existing = booking.companions.find((c) => c._id.toString() === comp._id);
        if (existing) {
          if (imageFile) {
            deleteLocalFile(existing.pass_image);
            existing.pass_image = `/uploads/${imageFile.filename}`;
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
          pass_image: imageFile ? `/uploads/${imageFile.filename}` : "",
        });
      }
    }

    // Update booking
    booking.name = name;
    booking.phone = phone;
    booking.address = address;
    booking.pass_number = pass_number;
    booking.plan = plan;
    booking.customPlan = customPlan;
    booking.paid = paid;
    booking.total = total;
    booking.pass_image = pass_image;
    booking.companions = [...updatedCompanions, ...newCompanions];
    booking.status = booking.visa ? "completed" : "pending";
    await booking.save();

    await Log.create({
      user: req.user._id,
      booking: booking._id,
      action: `تحديث الحجز`,
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateVisa = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "الحجز غير موجود" });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "ليس لديك صلاحية لعرض هذا المحتوى" });
    }

    // ✅ تحديث التأشيرة الرئيسية
    const mainVisaFile = req.files["visa"]?.[0];
    if (mainVisaFile) {
      deleteLocalFile(booking.visa);
      booking.visa = `/uploads/${mainVisaFile.filename}`;
      booking.status = "completed";
    }

    // ✅ تحديث تأشيرات المرافقين
    if (Array.isArray(booking.companions)) {
      for (let i = 0; i < booking.companions.length; i++) {
        const fieldName = `companions[${i}][visa]`;
        const companionVisaFile = req.files[fieldName]?.[0];

        if (companionVisaFile) {
          const companion = booking.companions[i];

          if (companion.visa) {
            deleteLocalFile(companion.visa);
          }

          companion.visa = `/uploads/${companionVisaFile.filename}`;
        }
      }
    }

    await booking.save();

    await Log.create({
      user: req.user._id,
      booking: booking._id,
      action: `تحديث التأشيرة`,
    });

    res.status(200).json({ message: "تم تحديث التأشيرات بنجاح", booking });
  } catch (error) {
    console.error("خطأ أثناء تحديث التأشيرات:", error);
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "الحجز غير موجود" });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role != "admin") {
      return res.status(403).json({ message: "ليس لديك صلاحية لعرض هذا المحتوي" });
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
        if (comp.visa) {
          deleteLocalFile(comp.visa); // ✅ delete visa file too
        }
      }
    }
    // Delete the booking itself
    await Booking.findByIdAndDelete(req.params.id);
    await Log.create({
      user: req.user._id,
      booking: booking._id,
      action: `حذف الحجز`,
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
  clinetBookingDetails,
  getBookings,
  deleteBooking,
  updateVisa,
  getAllBookings,
  getBookingDetails,
};
