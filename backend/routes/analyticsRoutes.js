const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// KPI and Chart dynamic endpoints
router.get('/stats', analyticsController.getStats);
router.get('/query', analyticsController.getQuery);

module.exports = router;
