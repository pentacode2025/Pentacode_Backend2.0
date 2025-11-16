const electorModel = require('../models/elector.model');
const { signToken } = require('../utils/jwt');

async function verificarElector(req, res, next) {
  try {
    const { dni, dv, fecha_emision } = req.body;
    if (!dni || !dv || !fecha_emision) return res.status(400).json({ message: 'dni, dv y fecha_emision son requeridos' });

    // Buscamos por coincidencia exacta en la BD: dni + fecha_emision + codigo_verificacion
    const elector = await electorModel.findByDniFechaDv({ dni: String(dni), dv: String(dv), fecha_emision });
    if (!elector) return res.status(404).json({ message: 'Elector no encontrado' });

  // Firmamos token incluyendo dni, dv y fecha_emision para que otros endpoints puedan re-validar
  const token = signToken({ electorDni: elector.dni, electorDv: elector.codigo_verificacion, electorFecha: elector.fecha_emision });
    res.json({ token, expiresIn: '5m' });
  } catch (err) { next(err); }
}

module.exports = { verificarElector };
