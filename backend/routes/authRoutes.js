const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/registrar', authService.registrar);
router.post('/login', authService.login);

module.exports = router;