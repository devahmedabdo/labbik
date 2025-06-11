const Plan = require('../models/Plan');
const Log = require('../models/Log');

// @desc    Create a new plan
// @route   POST /api/plans
// @access  Private/Admin
const createPlan = async (req, res) => {
  try {
    const { name, types, mecca, madinah } = req.body;
    const plan = await Plan.create({ name, types, mecca, madinah });
    res.status(201).send(plan);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to create plan' });
  }
};

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.send(plans);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch plans' });
  }
};

// @desc    Update a plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).send({ message: 'Plan not found' });

    const updated = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await Log.create({
      user: req.user._id,
      action: `Updated plan ${updated.name}`
    });

    res.send(updated);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update plan' });
  }
};

// @desc    Delete a plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).send({ message: 'Plan not found' });

    await Log.create({
      user: req.user._id,
      action: `Deleted plan ${plan.name}`
    });

    res.send({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete plan' });
  }
};

module.exports = {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan
};
