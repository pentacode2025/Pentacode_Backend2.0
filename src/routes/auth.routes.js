import express from 'express';
import controller from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/verificar-elector', controller.verificarElector);

export default router;
