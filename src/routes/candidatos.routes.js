// src/routes/candidatos.routes.js
import { Router } from "express";
import {
  getCandidatos,
  getCandidatosPorPartido,
} from "../controllers/candidatos.controller.js";

const router = Router();

// GET /api/candidatos → todos los registros de la hoja
router.get("/", getCandidatos);

// GET /api/candidatos/partido/:partidoPolitico → filtrar por partido_politico
router.get("/partido/:partidoPolitico", getCandidatosPorPartido);

export default router;
