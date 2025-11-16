const axios = require('axios');
/**
 * localhost:4000/api/v1/votacion/consulta
 */
const VOTACION_API_URL = 'http://161.132.53.195/api/v1/votacion/consulta';

/**
 * findByDniFechaDv
 * Consulta a la API de votación enviando { dni, fecha_emision, codigo_verificador }
 * Devuelve:
 * { dni, lugar_ubicacion, es_miembro_de_mesa, fecha_emision, codigo_verificacion }
 */
async function findByDniFechaDv({ dni, dv, fecha_emision }) {
  try {
    // Use GET with query params to call votacion-api (cannot modify votacion-api)
    const params = {
      dni: String(dni),
      fecha_emision,
      codigo_verificador: String(dv),
    };

    // Ensure URL includes protocol (if user set only host)
    const finalUrl = (/^https?:\/\//i.test(VOTACION_API_URL)) ? VOTACION_API_URL : `http://${VOTACION_API_URL}`;
    console.debug('votacion-api request (GET) ->', { url: finalUrl, params });

    const resp = await axios.get(finalUrl, { params, timeout: 7000 });
    const body = resp && resp.data;
    // votacion-api GET returns { total: 1, data: resultado } on success
    const data = body && (body.data || body);
    if (!data) return null;
    const item = Array.isArray(data) ? data[0] : data;
    if (!item) return null;

    // Map keys to the shape expected by controllers, and include other useful fields
    const mapped = {
      dni: item.dni || String(dni),
      nombre: item.nombre || null,
      lugar_ubicacion: item.lugar_votacion || item.lugar_ubicacion || item.ubicacion || null,
      direccion: item.direccion || null,
      latitud: typeof item.latitud !== 'undefined' ? item.latitud : null,
      longitud: typeof item.longitud !== 'undefined' ? item.longitud : null,
      mesa: item.mesa || null,
      pabellon: item.pabellon || null,
      es_miembro_de_mesa: (typeof item.miembro_mesa !== 'undefined') ? item.miembro_mesa : (item.es_miembro_de_mesa || false),
      fecha_emision: item.fecha_emision || fecha_emision,
      codigo_verificacion: item.codigo_verificador || item.codigo_verificacion || null,
      raw: item
    };
    return mapped;
  } catch (err) {
    // log details for debugging and differentiate 404 (not found) vs service errors
    if (err && err.response) {
      console.error('votacion-api error response status:', err.response.status);
      try { console.error('votacion-api error response body:', JSON.stringify(err.response.data)); } catch (e) { console.error('votacion-api error response body raw:', err.response.data); }
      if (err.response.status === 404) {
        return null; // elector not found
      }
      const e = new Error('votacion-api service error');
      e.status = 503;
      throw e;
    } else {
      console.error('Error consultando votacion-api findByDniFechaDv:', err && err.message);
      const e = new Error('votacion-api unreachable');
      e.status = 503;
      throw e;
    }
  }
}

module.exports = {
  findByDniFechaDv,
};
