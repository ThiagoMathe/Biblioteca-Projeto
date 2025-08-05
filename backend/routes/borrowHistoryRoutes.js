const express = require('express');
const router = express.Router();
const borrowService = require('../services/borrowHistoryService');

router.get('/', borrowService.getAllBorrowHistoryPaginated);
router.get('/search', borrowService.searchBorrowHistory);
router.post('/', borrowService.borrow);
router.patch('/return/:borrowId', borrowService.return);
router.get('/user/:userId', borrowService.getByUser);
router.get('/active', borrowService.getActive);
router.patch('/mark-late', borrowService.markLate);

module.exports = router;