const express = require('express');
const router = express.Router();
const controller = require('../controllers/indicador.controller');

router.get('/partido/:id', controller.indicadoresPartido);

module.exports = router;
