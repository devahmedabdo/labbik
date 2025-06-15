const Log = require('../models/Log');
const User = require('../models/User');
 

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  ) 
    await Log.create({
      user: req.user._id,
      action: `تحديث البيانات`,
    });
  res.status(200).send({ success: true }) ;
};

module.exports = { updateUser  };
