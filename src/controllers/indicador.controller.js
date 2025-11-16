// src/controllers/indicadores.controller.js
import {
  getIndicadoresFromSheet,
  getIndicadorByPartido,
} from "../services/googleSheetsService.js";

// GET /api/indicadores
export async function getIndicadores(req, res) {
  try {
    const indicadores = await getIndicadoresFromSheet();

    res.json({
      ok: true,
      total: indicadores.length,
      data: indicadores,
    });
  } catch (error) {
    console.error("[IndicadoresController] Error getIndicadores:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener indicadores desde Google Sheets",
      error: error.message,
    });
  }
}

// GET /api/indicadores/partido/:partidoPolitico
export async function getIndicadorPorPartido(req, res) {
  try {
    const { partidoPolitico } = req.params;

    if (!partidoPolitico) {
      return res.status(400).json({
        ok: false,
        message: "Debe proporcionar un nombre de partidoPolitico en la URL",
      });
    }

    const indicador = await getIndicadorByPartido(partidoPolitico);

    if (!indicador) {
      return res.status(404).json({
        ok: false,
        message: `No se encontraron indicadores para el partido político: ${partidoPolitico}`,
      });
    }

    res.json({
      ok: true,
      data: indicador,
    });
  } catch (error) {
    console.error("[IndicadoresController] Error getIndicadorPorPartido:", error);
    res.status(500).json({
      ok: false,
      message: "Error al buscar indicadores por partido político",
      error: error.message,
    });
  }
}
