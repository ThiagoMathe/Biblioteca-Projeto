const express = require('express');
const router = express.Router();
const controller = require('../controllers/livroController');

router.get('/', controller.getLivros);
router.post('/', controller.addLivro);
router.put('/:id', controller.updateLivro);
router.delete('/:id', controller.deleteLivro);

module.exports = router;