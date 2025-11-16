// src/routes/indicadores.routes.js
import { Router } from "express";
import {
  getIndicadores,
  getIndicadorPorPartido,
} from "../controllers/indicador.controller.js";

const router = Router();

// GET /api/indicadores
router.get("/", getIndicadores);

// GET /api/indicadores/partido/:partidoPolitico
router.get("/partido/:partidoPolitico", getIndicadorPorPartido);

export default router;
