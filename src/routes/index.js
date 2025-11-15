const express = require('express');
const router = express.Router();

router.use('/partidos', require('./partidos.routes'));
router.use('/postulantes', require('./postulantes.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/electores', require('./electores.routes'));
router.use('/mapas', require('./mapas.routes'));
router.use('/indicadores', require('./indicadores.routes'));
router.use('/cronograma', require('./cronograma.routes'));
router.use('/miembros-mesa', require('./miembros.routes'));

module.exports = router;
