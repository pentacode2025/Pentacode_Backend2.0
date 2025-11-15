const db = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * findByHashedDniDv
 * Busca en la tabla `elecciones.electores` comparando el dni (texto plano) con el hash almacenado en la columna `dni`
 * y el digito verificador con la columna `codigo_verificacion` usando bcrypt.compare.
 * Devuelve la fila encontrada (sin exponer hashes) o null.
 * Nota: debido a que los hashes son no determinísticos, esta función debe comparar con bcrypt.compare
 * contra los valores almacenados. Esto requiere leer las filas candidatas primero.
 */


async function findElectorByDniIssueDateAndVerifierDigit

async function findByHashedDniDv({ dni, dv }) {
  // Primero intentamos que la base de datos haga la comparación de hashes usando pgcrypto. Esto evita
  // traer todas las filas al servidor y que la aplicación tenga que comparar fila por fila.
  // Requiere la extensión pgcrypto y que los hashes hayan sido generados con un método compatible (por ejemplo bcrypt via crypt).
  const qDbCrypt = `SELECT dni AS dni_hash, lugar_ubicacion, es_miembro_de_mesa, fecha_emision
                    FROM elecciones.electores
                    WHERE crypt($1, dni) = dni AND crypt($2, codigo_verificacion) = codigo_verificacion
                    LIMIT 1`;
  try {
    const { rows } = await db.query(qDbCrypt, [String(dni), String(dv)]);
    if (rows && rows[0]) {
      return {
        dni_hash: rows[0].dni_hash,
        lugar_ubicacion: rows[0].lugar_ubicacion,
        es_miembro_de_mesa: rows[0].es_miembro_de_mesa,
        fecha_emision: rows[0].fecha_emision
      };
    }
  } catch (err) {
    // Si la consulta falla (p. ej. pgcrypto no instalado), caemos al fallback en la aplicación
    // console.warn('DB crypt() compare failed, falling back to app-side bcrypt compare:', err.message);
  }

  // Fallback: si pgcrypto no está disponible, leemos filas y comparamos con bcrypt.compare en la app.
  const q = 'SELECT dni AS dni_hash, lugar_ubicacion, es_miembro_de_mesa, fecha_emision, codigo_verificacion AS dv_hash FROM elecciones.electores';
  const { rows } = await db.query(q);
  for (const row of rows) {
    const dniMatch = row.dni_hash ? await bcrypt.compare(String(dni), row.dni_hash) : false;
    const dvMatch = row.dv_hash ? await bcrypt.compare(String(dv), row.dv_hash) : false;
    if (dniMatch && dvMatch) {
      return {
        dni_hash: row.dni_hash,
        lugar_ubicacion: row.lugar_ubicacion,
        es_miembro_de_mesa: row.es_miembro_de_mesa,
        fecha_emision: row.fecha_emision
      };
    }
  }

  return null;
}

async function getElectorByDniHash(dni_hash) {
  const q = 'SELECT dni AS dni_hash, lugar_ubicacion, es_miembro_de_mesa, fecha_emision FROM elecciones.electores WHERE dni = $1';
  const { rows } = await db.query(q, [dni_hash]);
  return rows[0] || null;
}

module.exports = {
  findByHashedDniDv,
  getElectorByDniHash
};
