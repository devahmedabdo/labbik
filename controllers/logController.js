const Log = require('../models/Log');
const getData = require('../utils/queryBuilder');


const getLogs = async (req, res) => {
  const data = await getData(Log, req.query,{}, ['user']);
  res.status(200).send(data);
};


module.exports = {
  getLogs
};