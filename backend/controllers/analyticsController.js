const orderService = require('../services/orderService');
const analyticsService = require('../services/analyticsService');

const getStats = async (req, res, next) => {
  try {
    const stats = await orderService.getStats(req.query);
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

const getQuery = async (req, res, next) => {
  try {
    const results = await analyticsService.query(req.query);
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getQuery
};
