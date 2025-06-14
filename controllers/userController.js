const User = require('../models/User');
 

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  ) 
  res.status(200).send({ message: 'User updated successfully' }) ;
};

module.exports = { updateUser  };
