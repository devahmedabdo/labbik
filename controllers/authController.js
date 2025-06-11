const jwt = require("jsonwebtoken");
const User = require("../models/User");
 

// 📌 Login
exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    // console.log(user)
    const token = await user.generateToken();
    // console.log(22222)
    res.status(200).send({ token });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

// 📌 Reset password (admin-only, not for users themselves)
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password reset successful" });
};
