import express from 'express';
import auth from '../middleware/auth.middleware.js';
import controller from '../controllers/mapa.controller.js';

const router = express.Router();

router.get('/mi-ubicacion', auth, controller.miUbicacion);

export default router;
