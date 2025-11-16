import db from '../config/database.js';

async function getAllPostulantes() {
  const q = 'SELECT p.id, p.nombre, p.cargo, pa.nombre as partido FROM postulantes p LEFT JOIN partidos pa ON p.partido_id = pa.id ORDER BY p.id';
  const { rows } = await db.query(q);
  return rows;
}

async function getPostulanteById(id) {
  const q = 'SELECT p.id, p.nombre, p.cargo, pa.nombre as partido FROM postulantes p LEFT JOIN partidos pa ON p.partido_id = pa.id WHERE p.id = $1';
  const { rows } = await db.query(q, [id]);
  return rows[0];
}

export default {
  getAllPostulantes,
  getPostulanteById
};
