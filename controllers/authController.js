const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../utils/mail");
const bcryptjs = require("bcryptjs");

//   Login
const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateToken();
    res.status(200).send({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};
//   logout
const logout = async (req, res) => {
  console.log(21);
  const user = req.user;
  user.tokens = user.tokens.filter((ele) => {
    return ele != req.token;
  });
  await user.save();
  res.status(200).send({ message: "تم تسجيل الخروج بنجاح" });
};
//change password when login
const updatePassword = async (req, res) => {
  const { old_password, new_password } = req.body;
  const user = await User.findById(req.user._id);
  if (!old_password) {
    return res.status(422).send({ message: "كلمة السر القديمة غير صحيحه" });
  }
  if (!new_password) {
    return res.status(422).send({ message: "حقل كلمة السر الجديده مطلوب" });
  }
  const isMatch = await bcryptjs.compare(old_password, user.password);
  if (!isMatch) {
    return res.status(422).send({ message: "حقل كلمة السر القديمة مطلوب" });
  }
  user.password = new_password;
  await user.save();
  res.status(200).send({ success: true });
};
//change password when login
const changePassword = async (req, res) => {
  const token = req.query.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decode._id, tokens: token });
  if (!user) {
    return res.status(404).send({ message: "المستخدم غير موجود" });
  }
  user.password = req.body.new_password;
  await user.save();
  res.status(201).send({ success: true });
};
// 🔐 Generate and email reset token
const resetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "المستخدم غير موجود" });
  const token = await user.generateToken("1Hour");
  await sendEmail(user.email, process.env.URL + token);
  res.status(200).send({ success: true });
};

module.exports = { changePassword, login, updatePassword, resetPassword, logout };
