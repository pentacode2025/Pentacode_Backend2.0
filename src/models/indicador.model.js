const db = require('../config/database');

async function getIndicadoresByPartidoId(partidoId) {
  // Example: return counts per categoria for a pie chart
  const q = `SELECT categoria, SUM(valor)::int as total FROM indicadores WHERE partido_id = $1 GROUP BY categoria`;
  const { rows } = await db.query(q, [partidoId]);
  return rows;
}

module.exports = { getIndicadoresByPartidoId };
