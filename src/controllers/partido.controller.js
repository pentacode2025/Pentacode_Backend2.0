const partidoModel = require('../models/partido.model');

async function listPartidos(req, res, next) {
  try {
    const rows = await partidoModel.getAllPartidos();
    res.json(rows);
  } catch (err) { next(err); }
}

async function detallePartido(req, res, next) {
  try {
    const id = Number(req.params.id);
    const partido = await partidoModel.getPartidoById(id);
    if (!partido) return res.status(404).json({ message: 'Partido no encontrado' });
    res.json(partido);
  } catch (err) { next(err); }
}

async function planPartido(req, res, next) {
  try {
    const id = Number(req.params.id);
    const plan = await partidoModel.getPlanByPartidoId(id);
    if (plan === null) return res.status(404).json({ message: 'Plan no encontrado' });
    res.json({ plan });
  } catch (err) { next(err); }
}

async function dashboardPartido(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await partidoModel.getDashboardByPartidoId(id);
    res.json(data);
  } catch (err) { next(err); }
}

async function postulantesPartido(req, res, next) {
  try {
    const id = Number(req.params.id);
    const rows = await partidoModel.getPostulantesByPartidoId(id);
    res.json(rows);
  } catch (err) { next(err); }
}

async function compararPartidos(req, res, next) {
  try {
    const idsParam = req.query.ids || '';
    const ids = idsParam.split(',').map(s => Number(s)).filter(Boolean);
    if (ids.length === 0) return res.status(400).json({ message: 'No se proporcionaron ids válidos' });
    const rows = await partidoModel.comparePartidosByIds(ids);
    res.json(rows);
  } catch (err) { next(err); }
}

module.exports = {
  listPartidos,
  detallePartido,
  planPartido,
  dashboardPartido,
  postulantesPartido,
  compararPartidos
};
