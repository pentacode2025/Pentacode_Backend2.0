import express from 'express';
import controller from '../controllers/postulante.controller.js';

const router = express.Router();

router.get('/', controller.listPostulantes);
router.get('/:id', controller.detallePostulante);

export default router;
