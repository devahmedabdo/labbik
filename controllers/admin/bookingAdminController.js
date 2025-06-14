const Booking = require('../../models/Booking');
const getData = require('../../utils/queryBuilder');

const getAllBookings = async (req, res) => {
  const data = await getData(Booking,req.query,{},['user']);
  res.status(200).send(data);
};


module.exports = { getAllBookings };
