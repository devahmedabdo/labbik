const Log = require("../models/Log");
const getData = require("../utils/queryBuilder");

const getLogs = async (req, res) => {
  const data = await getData(Log, req.query, {}, [{ name: "user", from: "users", select: ["name", "email"] },{ name: "booking", from: "bookings",   }]);
  res.status(200).send(data);
};

const deleteLog = async (req, res) => {
  const logId = req.params.id;
  const log = await Log.findById(logId);
  if (!log) return res.status(404).json({ message: "السجل غير موجود." });
  await Log.findByIdAndDelete(logId);
  res.status(200).json({ message: "تم حذف السجل بنجاح." });
};

const deleteBulkLogs = async (req, res) => {
  const { ids } = req.body;
  await Log.deleteMany({ _id: { $in: ids } });
  res.status(200).send({ message: "تم حذف السجلات بنجاح" });
};

module.exports = {
  getLogs,
  deleteLog,
  deleteBulkLogs,
};
