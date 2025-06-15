const Booking = require("../../models/Booking");
const Issue = require("../../models/Issue");
const getData = require("../../utils/queryBuilder");

const createIssue = async (req, res) => {
  const booking = await Booking.findOne({ phone: req.body.phone });
  if (!booking) return res.status(409).send({ message: "رقم الهاتف هذا غير مسجل لدينا برجاء كتابة رقم الهاتف الموجود ببيانات الحجز" });
  req.body.booking = booking;
  await Issue.create(req.body);
  res.status(201).send({ success: true });
};
const updateIssue = async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  issue.status = req.body.status;
  await issue.save();
  res.status(201).send({ success: true });
};

const getAllIssues = async (req, res) => {
  const issues = await getData(Issue,req.query,{},[{ name: "booking", from: "bookings",   }]);
  res.status(200).send(issues);
};

const deleteIssue = async (req, res) => {
  await Issue.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "تم الحذف بنجاح" });
};

const deleteBulkIssues = async (req, res) => {
  const { ids } = req.body;
  await Issue.deleteMany({ _id: { $in: ids } });
  res.status(200).send({ message: "تم حذف الشكاوي بنجاح" });
};

module.exports = { createIssue, getAllIssues, deleteIssue, updateIssue, deleteBulkIssues };
