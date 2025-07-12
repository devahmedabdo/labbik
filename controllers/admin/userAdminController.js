const User = require("../../models/User");
const getData = require("../../utils/queryBuilder");

// Helper to check if the logged user can modify another super user
const isSuper = (logged, targetUser) => {
  if (targetUser.super && targetUser._id.toString() !== logged._id.toString()) {
    const error = new Error("ليس لديك صلاحية لهذا الاجراء");
    error.status = 409;
    throw error;
  }
};

const createUser = async (req, res) => {
  try {
    delete req.body?.super;
    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message || "فشل في إنشاء المستخدم" });
  }
};

const updateUser = async (req, res) => {
  try {
    // req.body?.super =true;

    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).send({ message: "المستخدم غير موجود" });

    // isSuper(req.user, user);
user.super = true
    Object.assign(user, req.body);
    await user.save();

    res.status(200).send(user);
  } catch (err) {
    res.status(err.status || 500).send({ message: err.message || "فشل في تحديث المستخدم" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await getData(User, {...req.query,order:'dsc',sort:'super'}, {}, [], ["email", "name", "role"]);
    res.json(users);
  } catch (err) {
    res.status(500).send({ message: err.message || "فشل في جلب المستخدمين" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "المستخدم غير موجود" });

    isSuper(req.user, user);

    if (req.user._id.toString() === req.params.id) {
      return res.status(409).send({ message: "لا يمكنك حذف نفسك كمدير" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "تم حذف المستخدم" });
  } catch (err) {
    res.status(err.status || 500).send({ message: err.message || "فشل في حذف المستخدم" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
};
