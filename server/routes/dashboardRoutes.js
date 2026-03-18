const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');



const {
  getDashboardConfig,
  saveDashboardConfig
} = require('../controllers/dashboardController');
router.get('/', auth, getDashboardConfig);
router.post('/', auth, saveDashboardConfig);

// router.get('/', getDashboardConfig);
// router.post('/', saveDashboardConfig);

module.exports = router;