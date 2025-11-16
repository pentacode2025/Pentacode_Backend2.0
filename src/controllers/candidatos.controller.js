// src/controllers/candidatos.controller.js
import {
  getCandidatosFromSheet,
  getCandidatosByPartido,
} from "../services/candidatosSheetService.js";

// GET /api/candidatos
export async function getCandidatos(req, res) {
  try {
    const candidatos = await getCandidatosFromSheet();

    res.json({
      ok: true,
      total: candidatos.length,
      data: candidatos,
    });
  } catch (error) {
    console.error("[CandidatosController] Error getCandidatos:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener candidatos desde Google Sheets",
      error: error.message,
    });
  }
}

// GET /api/candidatos/partido/:partidoPolitico
export async function getCandidatosPorPartido(req, res) {
  try {
    const { partidoPolitico } = req.params;

    if (!partidoPolitico) {
      return res.status(400).json({
        ok: false,
        message:
          "Debes proporcionar el nombre del partido político en la URL (parametro :partidoPolitico)",
      });
    }

    const candidatos = await getCandidatosByPartido(partidoPolitico);

    if (!candidatos || candidatos.length === 0) {
      return res.status(404).json({
        ok: false,
        message: `No se encontraron candidatos para el partido político: ${partidoPolitico}`,
      });
    }

    res.json({
      ok: true,
      total: candidatos.length,
      data: candidatos,
    });
  } catch (error) {
    console.error(
      "[CandidatosController] Error getCandidatosPorPartido:",
      error
    );
    res.status(500).json({
      ok: false,
      message: "Error al buscar candidatos por partido político",
      error: error.message,
    });
  }
}
