import express from 'express';
import controller from '../controllers/partido.controller.js';

const router = express.Router();

router.get('/', controller.listPartidos);
router.get('/comparar', controller.compararPartidos);
router.get('/:id', controller.detallePartido);
router.get('/:id/plan', controller.planPartido);
router.get('/:id/dashboard', controller.dashboardPartido);
router.get('/:id/postulantes', controller.postulantesPartido);

export default router;
