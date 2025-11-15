const express = require('express');
const router = express.Router();
const controller = require('../controllers/partido.controller');

router.get('/', controller.listPartidos);
router.get('/comparar', controller.compararPartidos);
router.get('/:id', controller.detallePartido);
router.get('/:id/plan', controller.planPartido);
router.get('/:id/dashboard', controller.dashboardPartido);
router.get('/:id/postulantes', controller.postulantesPartido);

module.exports = router;
