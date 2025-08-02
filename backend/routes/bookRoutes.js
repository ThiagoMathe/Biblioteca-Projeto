const express = require('express');
const router = express.Router();
const bookService = require('../services/bookServices');

router.get('/', bookService.get);
router.post('/', bookService.add);
router.put('/:id', bookService.update);
router.delete('/:id', bookService.delete);

module.exports = router;