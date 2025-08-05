const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboardService');

router.get('/', dashboardService.getDashboardData);

module.exports = router;