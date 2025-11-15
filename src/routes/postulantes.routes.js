const express = require('express');
const router = express.Router();
const controller = require('../controllers/postulante.controller');

router.get('/', controller.listPostulantes);
router.get('/:id', controller.detallePostulante);

module.exports = router;
