const electorModel = require('../models/elector.model');

async function miInfo(req, res, next) {
  try {
    const electorDniHash = req.user && req.user.electorDniHash;
    if (!electorDniHash) return res.status(401).json({ message: 'No autorizado' });
    const elector = await electorModel.getElectorByDniHash(electorDniHash);
    if (!elector) return res.status(404).json({ message: 'Elector no encontrado' });
    // retornar info útil (no exponer hashes)
    res.json({ lugar_ubicacion: elector.lugar_ubicacion, es_miembro_de_mesa: elector.es_miembro_de_mesa, fecha_emision: elector.fecha_emision });
  } catch (err) { next(err); }
}

module.exports = { miInfo };
