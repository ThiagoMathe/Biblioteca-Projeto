const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.get('/', userService.get);
router.get('/search', userService.search);

module.exports = router;