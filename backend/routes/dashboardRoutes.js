const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.getDashboard);
router.post('/save', dashboardController.saveDashboard);
router.delete('/widget/:id', dashboardController.removeWidget);

module.exports = router;
