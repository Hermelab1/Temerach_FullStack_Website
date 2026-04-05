const express = require('express');
const router = express.Router();
const dashController = require('../controller/dashboardcontroller');

router.get('/stats', dashController.getDashboardStats);
router.get('/recent-orders', dashController.getRecentOrders);
router.get('/alerts', dashController.getDashboardAlerts);

module.exports = router;