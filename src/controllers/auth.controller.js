const electorModel = require('../models/elector.model');
const { signToken } = require('../utils/jwt');

async function verificarElector(req, res, next) {
  try {
    const { dni, dv } = req.body;
    if (!dni || !dv) return res.status(400).json({ message: 'El dni y el digito verificador son requeridos' });

    // Buscamos por coincidencia de hash en las columnas reales de la BD (dni y codigo_verificacion)
    const elector = await electorModel.findByHashedDniDv({ dni: String(dni), dv: String(dv) });
    if (!elector) return res.status(404).json({ message: 'Elector no encontrado' });

    // Firmamos token con el hash del dni (dni_hash) como identificador seguro para posteriores consultas
    const token = signToken({ electorDniHash: elector.dni_hash });
    res.json({ token, expiresIn: '5m' });
  } catch (err) { next(err); }
}

module.exports = { verificarElector };
