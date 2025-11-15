const db = require('../config/database');

async function miUbicacion(req, res, next) {
  try {
    const electorDniHash = req.user && req.user.electorDniHash;
    if (!electorDniHash) return res.status(401).json({ message: 'No autorizado' });

    const q = `SELECT dni AS dni_hash, lugar_ubicacion, es_miembro_de_mesa, fecha_emision FROM elecciones.electores WHERE dni = $1`;
    const { rows } = await db.query(q, [electorDniHash]);
    if (!rows[0]) return res.status(404).json({ message: 'No se encontró ubicación' });
    // Devolvemos la ubicación y si es miembro de mesa
    const r = rows[0];
    res.json({ lugar_ubicacion: r.lugar_ubicacion, es_miembro_de_mesa: r.es_miembro_de_mesa, fecha_emision: r.fecha_emision });
  } catch (err) { next(err); }
}

module.exports = { miUbicacion };
