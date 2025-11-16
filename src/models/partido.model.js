import db from '../config/database.js';

async function getAllPartidos() {
  const q = 'SELECT id, nombre, plan, created_at FROM partidos ORDER BY id';
  const { rows } = await db.query(q);
  return rows;
}

async function getPartidoById(id) {
  const q = 'SELECT id, nombre, plan FROM partidos WHERE id = $1';
  const { rows } = await db.query(q, [id]);
  return rows[0];
}

async function getPlanByPartidoId(id) {
  const q = 'SELECT plan FROM partidos WHERE id = $1';
  const { rows } = await db.query(q, [id]);
  return rows[0] ? rows[0].plan : null;
}

async function getDashboardByPartidoId(id) {
  // Example: counts for grafico
  const q1 = 'SELECT COUNT(*)::int as postulantes FROM postulantes WHERE partido_id = $1';
  const q2 = 'SELECT COUNT(*)::int as votos_simulados FROM indicadores WHERE partido_id = $1';
  const r1 = await db.query(q1, [id]);
  const r2 = await db.query(q2, [id]);
  return {
    postulantes: r1.rows[0].postulantes || 0,
    votos_simulados: r2.rows[0] ? r2.rows[0].votos_simulados : 0
  };
}

async function getPostulantesByPartidoId(id) {
  const q = 'SELECT id, nombre, cargo FROM postulantes WHERE partido_id = $1 ORDER BY id';
  const { rows } = await db.query(q, [id]);
  return rows;
}

async function comparePartidosByIds(ids) {
  // ids: array of integers
  const q = 'SELECT id, nombre, plan FROM partidos WHERE id = ANY($1::int[])';
  const { rows } = await db.query(q, [ids]);
  return rows;
}

export default {
  getAllPartidos,
  getPartidoById,
  getPlanByPartidoId,
  getDashboardByPartidoId,
  getPostulantesByPartidoId,
  comparePartidosByIds
};
