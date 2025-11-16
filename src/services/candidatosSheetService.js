// src/services/candidatosSheetService.js
import axios from "axios";
import { parse } from "csv-parse/sync";

// Google Sheet de CANDIDATOS
const SPREADSHEET_ID = "1EZjKWj4VtQfQOas779h1WLJiJOdQldS-g8J2xgyvkeU";
const SHEET_GID = "0";

const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

/**
 * Lee la Google Sheet de candidatos y la convierte en un array de objetos JSON.
 * Usa la PRIMERA FILA como nombres de campo (keys del objeto).
 * Ejemplo de salida:
 * [
 *   {
 *     "id": "1",
 *     "datos_completos": "Juan Pérez",
 *     "partido_politico": "PARTIDO X",
 *     ...
 *   },
 *   ...
 * ]
 */
export async function getCandidatosFromSheet() {
  const response = await axios.get(SHEET_CSV_URL, {
    responseType: "text",
  });

  const csvText = response.data;

  // columns:true = usa la primera fila como nombres de columnas
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // Aquí podrías castear tipos (por ahora lo dejamos todo como string)
  return records;
}

/**
 * Devuelve los candidatos filtrados por partido_politico.
 * Busca usando el campo "partido_politico" de la hoja.
 * La comparación es case-insensitive y con trim.
 */
export async function getCandidatosByPartido(partidoPoliticoBuscado) {
  if (!partidoPoliticoBuscado) return [];

  const candidatos = await getCandidatosFromSheet();

  const buscadoNormalizado = partidoPoliticoBuscado.trim().toLowerCase();

  const filtrados = candidatos.filter((row) => {
    const partido = (row.partido_politico || row.PARTIDO_POLITICO || "").trim().toLowerCase();
    return partido === buscadoNormalizado;
  });

  return filtrados;
}
