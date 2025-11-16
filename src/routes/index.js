import express from 'express';
import partidosRoutes from './partidos.routes.js';
import authRoutes from './auth.routes.js';
import electoresRoutes from './electores.routes.js';
import mapasRoutes from './mapas.routes.js';
import indicadoresRoutes from './indicadores.routes.js';
import miembrosRoutes from './miembros.routes.js';
import candidatosRoutes from './candidatos.routes.js';

const router = express.Router();

router.use('/partidos', partidosRoutes);
router.use('/auth', authRoutes);
router.use('/electores', electoresRoutes);
router.use('/mapas', mapasRoutes);
router.use('/indicadores', indicadoresRoutes);
router.use('/miembros-mesa', miembrosRoutes);
router.use("/candidatos", candidatosRoutes);

export default router;
