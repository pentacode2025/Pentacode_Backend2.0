const db = require('../config/database');

/**
 * findByDniFechaDv
 * Busca en la tabla `elecciones.electores` por coincidencia exacta de dni, fecha_emision y codigo_verificacion.
 * Devuelve la fila encontrada o null.
 */
async function findByDniFechaDv({ dni, dv, fecha_emision }) {
  const q = `SELECT dni, lugar_ubicacion, es_miembro_de_mesa, fecha_emision, codigo_verificacion
             FROM elecciones.electores
             WHERE dni = $1 AND fecha_emision = $2 AND codigo_verificacion = $3
             LIMIT 1`;
  const params = [String(dni), fecha_emision, String(dv)];
  const { rows } = await db.query(q, params);
  if (rows && rows[0]) {
    return rows[0];
  }
  return null;
}

async function getElectorByDni(dni) {
  const q = 'SELECT dni, lugar_ubicacion, es_miembro_de_mesa, fecha_emision FROM elecciones.electores WHERE dni = $1';
  const { rows } = await db.query(q, [String(dni)]);
  return rows[0] || null;
}

module.exports = {
  findByDniFechaDv,
  getElectorByDni
};
