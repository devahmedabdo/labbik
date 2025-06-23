const User = require("../../models/User");
const getData = require("../../utils/queryBuilder");

const createUser = async (req, res) => {
  delete req.body.role;
  const { name, email, password, role = "user" } = req.body;
  const user =  new User({ name, email, password, role });
  await user.save()
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
  const users =  await getData(User,req.query,{},[],['email','name','role'])  
  res.json(users);
};
const deleteUser = async (req, res) => {
  if(req.user._id == req.params.id)  return res.status(409).send({ message: "you can't delete admin" });
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "User deleted" });
};

module.exports = { createUser, getAllUsers, deleteUser, updateUser };
// 