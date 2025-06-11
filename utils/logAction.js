const Log = require('../models/Log');

async function logAction(userId, action) {
  await Log.create({ user: userId, action });
}
module.exports = logAction;