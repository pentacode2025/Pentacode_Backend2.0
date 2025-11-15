const indicadorModel = require('../models/indicador.model');

async function indicadoresPartido(req, res, next) {
  try {
    const partidoId = Number(req.params.id);
    const rows = await indicadorModel.getIndicadoresByPartidoId(partidoId);
    res.json(rows);
  } catch (err) { next(err); }
}

module.exports = { indicadoresPartido };
