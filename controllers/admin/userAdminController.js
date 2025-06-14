const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  delete req.body.role;
  const { name, email, password, role = "user" } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });
  res.status(201).send(user);
};
const updateUser = async (req, res) => {
  delete req.body.role;
  const user = await User.findById(req.params.id);
  Object.keys(req.body).forEach((key) => {
    user[key] = req.body[key];
  });
  await user.save();
  res.status(201).send(user);
};
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password -role -tokens -__v");
  res.json(users);
};
const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "User deleted" });
};

module.exports = { createUser, getAllUsers, deleteUser, updateUser };
