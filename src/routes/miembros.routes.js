import express from 'express';
const router = express.Router();
import controller from '../controllers/miembro.controller.js';

router.get('/:dni', controller.verificarMiembro);

export default router;
