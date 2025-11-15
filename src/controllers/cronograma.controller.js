const cronogramaModel = require('../models/cronograma.model');

async function listCronograma(req, res, next) {
  try {
    const es_para_mm = req.query.es_para_mm === 'true' ? true : (req.query.es_para_mm === 'false' ? false : undefined);
    const rows = await cronogramaModel.getCronograma(es_para_mm);
    res.json(rows);
  } catch (err) { next(err); }
}

module.exports = { listCronograma };
