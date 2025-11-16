import db from '../config/database.js';
import electorModel from '../models/elector.model.js';

async function miUbicacion(req, res, next) {
  try {
  const electorDni = req.user && req.user.electorDni;
  const electorDv = req.user && req.user.electorDv;
  const electorFecha = req.user && req.user.electorFecha;
  if (!electorDni || !electorDv || !electorFecha) return res.status(401).json({ message: 'No autorizado' });

  // Re-validamos y obtenemos la ubicación usando el método findByDniFechaDv
  const elector = await electorModel.findByDniFechaDv({ dni: String(electorDni), dv: String(electorDv), fecha_emision: electorFecha });
  if (!elector) return res.status(404).json({ message: 'No se encontró ubicación' });
  // return full elector object including location and coordinates
  res.json(elector);
  } catch (err) { next(err); }
}

export default { miUbicacion };
