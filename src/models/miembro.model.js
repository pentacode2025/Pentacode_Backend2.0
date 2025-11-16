import db from '../config/database.js';
import bcrypt from 'bcryptjs';

async function isMiembroByDni(dni) {
  // members table stores hashed_dni
  const q = 'SELECT id, nombre, hashed_dni, mesa_id FROM miembros_mesa';
  const { rows } = await db.query(q);
  for (const row of rows) {
    if (row.hashed_dni) {
      const ok = await bcrypt.compare(dni, row.hashed_dni);
      if (ok) {
        return { id: row.id, nombre: row.nombre, mesa_id: row.mesa_id };
      }
    }
  }
  return null;
}

export default { isMiembroByDni };
