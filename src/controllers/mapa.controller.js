const db = require('../config/database');

async function miUbicacion(req, res, next) {
  try {
  const electorDni = req.user && req.user.electorDni;
  const electorDv = req.user && req.user.electorDv;
  const electorFecha = req.user && req.user.electorFecha;
  if (!electorDni || !electorDv || !electorFecha) return res.status(401).json({ message: 'No autorizado' });

  // Re-validamos y obtenemos la ubicación usando el método findByDniFechaDv
  const elector = await require('../models/elector.model').findByDniFechaDv({ dni: String(electorDni), dv: String(electorDv), fecha_emision: electorFecha });
  if (!elector) return res.status(404).json({ message: 'No se encontró ubicación' });
  res.json({ lugar_ubicacion: elector.lugar_ubicacion, es_miembro_de_mesa: elector.es_miembro_de_mesa, fecha_emision: elector.fecha_emision });
  } catch (err) { next(err); }
}

module.exports = { miUbicacion };
