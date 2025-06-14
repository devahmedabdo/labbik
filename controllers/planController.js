const Plan = require('../models/Plan');

const getPlans = async (req, res) => {
  const plans = await Plan.find();
  res.send(plans);
};

const getSelectPlans = async (req, res) => {
  const plans = await Plan.find({status:true},'-__v -createdAt -updatedAt -status');
  res.send(plans);
};

const createPlan = async (req, res) => {
  const { name, types, mecca, madinah,airline,details } = req.body;
  const plan = await Plan.create({ name, types, mecca, madinah ,airline,details});
  res.status(201).send(plan);
};
const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).send({ message: 'Plan not found' });
    const updated = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updated);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update plan' });
  }
};
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).send({ message: 'Plan not found' });
    res.send({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete plan' });
  }
};
module.exports = {
  createPlan,
  getPlans,
  getSelectPlans,
  updatePlan,
  deletePlan
};
