// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  next();
  return
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, tokens: token });
    if (!user) {
      return res.status(401).send({ message: "Unuthenticated" });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unuthenticated" });
  }
};

const adminOnly = (req, res, next) => {
    next();
  return
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
module.exports = {protect ,adminOnly };