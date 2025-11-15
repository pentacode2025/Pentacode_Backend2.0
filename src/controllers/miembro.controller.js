const miembroModel = require('../models/miembro.model');

async function verificarMiembro(req, res, next) {
  try {
    const dni = req.params.dni;
    if (!dni) return res.status(400).json({ message: 'DNI requerido' });
    const miembro = await miembroModel.isMiembroByDni(String(dni));
    if (!miembro) return res.status(404).json({ message: 'No es miembro de mesa' });
    res.json({ miembro });
  } catch (err) { next(err); }
}

module.exports = { verificarMiembro };
