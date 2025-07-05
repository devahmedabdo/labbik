const Plan = require("../models/Plan");
const getData = require("../utils/queryBuilder");

const getPlans = async (req, res) => {
  const plans = await getData(Plan, req.query);
  res.send(plans);
};
const getUserPlans = async (req, res) => {
  const data = await getData(Plan, req.query, { user: req.user._id }, [{ name: "user", form: "users", select: ["name", "email"] }]);
  res.status(200).send(data);
};
const getSelectPlans = async (req, res) => {
  const plans = await Plan.find({ status: true }, "-__v -createdAt -updatedAt -status");
  res.send(plans);
};
const createPlan = async (req, res) => {
  const { name, types, mecca, madinah, airline, details } = req.body;
  const plan = await Plan.create({ name, types, mecca, madinah, airline, details, user: req.user._id });
  res.status(201).send({ success: true, plan });
};
const updatePlan = async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (plan.user.toString() !== req.user._id.toString() && req.user.role != "admin") {
    return res.status(403).json({ message: "ليس لديك صلاحية لتعديل هذا المحتوي" });
  }
  if (!plan) return res.status(404).send({ message: "الباقه غير موجوده" });
  const updated = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send({ success: true });
};
const deletePlan = async (req, res) => {
  const plan = await Plan.findByIdAndDelete(req.params.id);
  if (plan.user.toString() !== req.user._id.toString() && req.user.role != "admin") {
    return res.status(403).json({ message: "ليس لديك صلاحية لحذف هذا المحتوي" });
  }
  if (!plan) return res.status(404).send({ message: "الباقه غير موجوده" });
  res.status(200).send({ success: true });
};
module.exports = {
  createPlan,
  getPlans,
  getSelectPlans,
  updatePlan,
  deletePlan,
  getUserPlans,
};
