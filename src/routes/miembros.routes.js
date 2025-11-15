const express = require('express');
const router = express.Router();
const controller = require('../controllers/miembro.controller');

router.get('/:dni', controller.verificarMiembro);

module.exports = router;
