import express from 'express';
import auth from '../middleware/auth.middleware.js';
import controller from '../controllers/elector.controller.js';

const router = express.Router();

router.get('/mi-info', auth, controller.miInfo);

export default router;
