const Log = require("../models/Log");
const getData = require("../utils/queryBuilder");

const getLogs = async (req, res) => {
  const data = await getData(Log, req.query, {}, [{ name: "user", from: "users", select: ["name", "email"] }]);
  res.status(200).send(data);
};

const deleteLog = async (req, res) => {
  try {
    const logId = req.params.id;
    const log = await Log.findById(logId);
    if (!log) {
      return res.status(404).json({ message: 'السجل غير موجود.' });
    }
    await Log.findByIdAndDelete(logId);
    res.status(200).json({ message: 'تم حذف السجل بنجاح.' });
  } catch (error) {
    console.error('Delete log error:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم.' });
  }
};

const deleteBulkLogs = async (req, res) => {
  const { ids } = req.body;
  await Log.deleteMany({ _id: { $in: ids } });
  res.status(200).send({ message: "logs has been deleted" });
};

module.exports = {
  getLogs,
  deleteLog,
  deleteBulkLogs,
};
