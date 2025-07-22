const express = require('express');
const router = express.Router();
const services = require('../services/livroServices');

router.get('/', services.getLivros);
router.post('/', services.addLivro);
router.put('/:id', services.updateLivro);
router.delete('/:id', services.deleteLivro);

module.exports = router;