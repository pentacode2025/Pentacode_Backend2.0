import electorModel from '../models/elector.model.js';
import { signToken } from '../utils/jwt.js';

async function verificarElector(req, res, next) {
  try {
    // Accept either `dv` or `codigo_verificador` from the client
    const { dni, dv, codigo_verificador, fecha_emision } = req.body;
    const verifier = codigo_verificador || dv;
    if (!dni || !verifier || !fecha_emision) return res.status(400).json({ message: 'dni, fecha_emision y codigo_verificador son requeridos' });

    // Basic validation
    if (!/^[0-9]{8}$/.test(String(dni))) return res.status(400).json({ message: 'El DNI debe tener 8 dígitos' });
    if (!/^[0-9]$/.test(String(verifier))) return res.status(400).json({ message: 'Codigo verificador inválido' });

    // Normalize fecha_emision to YYYY-MM-DD
    let normalizedFecha = String(fecha_emision || '').trim();
    const m = normalizedFecha.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) {
      const year = m[1];
      const month = m[2].padStart(2, '0');
      const day = m[3].padStart(2, '0');
      normalizedFecha = `${year}-${month}-${day}`;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedFecha)) return res.status(400).json({ message: 'fecha_emision debe tener formato YYYY-MM-DD' });

    console.debug('auth.verificarElector -> calling model with', { dni, fecha_emision: normalizedFecha, codigo_verificador: verifier });
    const elector = await electorModel.findByDniFechaDv({ dni: String(dni), dv: String(verifier), fecha_emision: normalizedFecha });
    if (!elector) return res.status(404).json({ message: 'Elector no encontrado' });

    const token = signToken({ electorDni: elector.dni, electorDv: elector.codigo_verificacion, electorFecha: elector.fecha_emision });

    // Optionally return elector data together with token to save an extra roundtrip.
    // Client can request it by sending `withElector=true` either in query string or body.
    const wantElector = (req.query && (req.query.withElector === '1' || req.query.withElector === 'true')) || (req.body && (req.body.withElector === true || req.body.withElector === 'true' || req.body.withElector === '1'));

    if (wantElector) {
      return res.json({ token, expiresIn: '5m', elector });
    }

    res.json({ token, expiresIn: '5m' });
  } catch (err) { next(err); }
}

export default { verificarElector };
