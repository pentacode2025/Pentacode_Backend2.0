const db = require('../config/database');

async function getCronograma(es_para_mm) {
  if (typeof es_para_mm === 'boolean') {
    const q = 'SELECT id, titulo, descripcion, fecha, es_para_mm FROM cronograma WHERE es_para_mm = $1 ORDER BY fecha';
    const { rows } = await db.query(q, [es_para_mm]);
    return rows;
  }
  const q = 'SELECT id, titulo, descripcion, fecha, es_para_mm FROM cronograma ORDER BY fecha';
  const { rows } = await db.query(q);
  return rows;
}

module.exports = { getCronograma };
