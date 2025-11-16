// src/services/googleSheetsService.js
import axios from "axios";
import { parse } from "csv-parse/sync";

// Hoja que me pasaste:
const SPREADSHEET_ID = "1W62_axNbGwdvIkni07m8dPSYmegA5AuO9a1n6baZENQ";
const SHEET_GID = "0";

const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

function toInt(value) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * Devuelve TODOS los indicadores de la Google Sheet
 */
export async function getIndicadoresFromSheet() {
  const response = await axios.get(SHEET_CSV_URL, {
    responseType: "text",
  });

  const csvText = response.data;

  const rows = parse(csvText, {
    columns: false,
    skip_empty_lines: true,
    trim: true,
  });

  if (!rows.length) return [];

  const dataRows = rows.slice(1); // saltar encabezados

  const indicadores = dataRows
    .filter((row) => row[0]) // PARTIDO POLITICO no vacío
    .map((row) => ({
      partidoPolitico: row[0], // A

      edu: toInt(row[1]), // B
      sal: toInt(row[2]), // C
      seg: toInt(row[3]), // D
      eco: toInt(row[4]), // E
      est: toInt(row[5]), // F
      soc: toInt(row[6]), // G
      med: toInt(row[7]), // H
      inf: toInt(row[8]), // I
      cul: toInt(row[9]), // J
      agr: toInt(row[10]), // K
      tec: toInt(row[11]), // L
      ext: toInt(row[12]), // M
      otr: toInt(row[13]), // N
    }));

  return indicadores;
}

/**
 * Devuelve los indicadores de UN partido específico.
 * Búsqueda case-insensitive y con trim.
 */
export async function getIndicadorByPartido(partidoPoliticoBuscado) {
  if (!partidoPoliticoBuscado) return null;

  const indicadores = await getIndicadoresFromSheet();

  const buscadoNormalizado = partidoPoliticoBuscado.trim().toLowerCase();

  const encontrado = indicadores.find(
    (item) =>
      item.partidoPolitico &&
      item.partidoPolitico.trim().toLowerCase() === buscadoNormalizado
  );

  return encontrado || null;
}
