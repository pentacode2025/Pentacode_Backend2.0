const postulanteModel = require('../models/postulante.model');

async function listPostulantes(req, res, next) {
  try {
    const rows = await postulanteModel.getAllPostulantes();
    res.json(rows);
  } catch (err) { next(err); }
}

async function detallePostulante(req, res, next) {
  try {
    const id = Number(req.params.id);
    const row = await postulanteModel.getPostulanteById(id);
    if (!row) return res.status(404).json({ message: 'Postulante no encontrado' });
    res.json(row);
  } catch (err) { next(err); }
}

module.exports = { listPostulantes, detallePostulante };
