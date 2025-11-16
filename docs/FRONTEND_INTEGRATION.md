**Integración del frontend con el backend de verificación de electores**

Este documento explica cómo integrar el frontend con los endpoints del backend que verifican DNI/fecha/código verificator, emiten un token de sesión de 5 minutos y permiten recuperar la información del elector.

1) Resumen del flujo
- Paso 1 (Verificar): el frontend envía `POST /api/v1/auth/verificar-elector` con JSON `{ dni, fecha_emision, codigo_verificador }`. El backend valida y llama a la `votacion-api`. Si todo OK, firma un JWT con 5 minutos de validez.
- Paso 2 (Usar token): el frontend usa el token en el header `Authorization: Bearer <TOKEN>` para pedir `GET /api/v1/electores/mi-info` y mostrar los datos del elector (nombre, dirección, coordenadas, mesa, es_miembro_de_mesa, etc.).
- Alternativa: para evitar dos llamadas, el frontend puede pedir `withElector=true` cuando llama a `verificar-elector` y recibir `{ token, expiresIn, elector }` en la misma respuesta.

2) Requisitos en el frontend
- CORS: asegúrate de que `FRONTEND_URL` (o `*` en desarrollo) esté configurado en el backend. El backend ya permite CORS y credenciales si configuras `FRONTEND_URL`.
- Content-Type: enviar `Content-Type: application/json` en requests POST.

3) Ejemplos prácticos

a) Petición de verificación (obtener token y elector en una sola llamada)

Axios (Node/Browser):
```js
import axios from 'axios';

async function verifyAndGetElector(dni, fecha_emision, codigo_verificador) {
  const body = { dni, fecha_emision, codigo_verificador };
  // withElector in query to request elector in the same response
  const res = await axios.post('/api/v1/auth/verificar-elector?withElector=true', body, {
    headers: { 'Content-Type': 'application/json' }
  });
  // returns { token, expiresIn, elector }
  return res.data;
}
```

fetch (browser):
```js
async function verifyAndGetElectorFetch(dni, fecha_emision, codigo_verificador) {
  const res = await fetch('/api/v1/auth/verificar-elector?withElector=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dni, fecha_emision, codigo_verificador })
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
```

b) Usar token para pedir `mi-info` (se recomienda usar axios instance con interceptor)

Axios instance + interceptor example:
```js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api/v1' });

// attach token automatically if present
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token'); // or in-memory store
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// handle 401 centrally
api.interceptors.response.use(r => r, err => {
  if (err.response && err.response.status === 401) {
    const msg = err.response.data && err.response.data.message;
    if (msg === 'Token expired') {
      // redirect to verification page or show modal
      window.location.href = '/verify';
    } else {
      // invalid token - force re-login
      sessionStorage.removeItem('token');
      window.location.href = '/verify';
    }
  }
  return Promise.reject(err);
});

// usage
async function getMiInfo() {
  const res = await api.get('/electores/mi-info');
  return res.data; // elector object
}
```

4) React example (AuthProvider + useAuth hook)

This pattern stores token and elector in React state and sessionStorage and handles automatic redirect on token expiration.

```js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [elector, setElector] = useState(() => JSON.parse(sessionStorage.getItem('elector') || 'null'));

  useEffect(() => {
    // store token/elector in sessionStorage so reloads survive but cleared on browser close
    if (token) sessionStorage.setItem('token', token); else sessionStorage.removeItem('token');
    if (elector) sessionStorage.setItem('elector', JSON.stringify(elector)); else sessionStorage.removeItem('elector');
  }, [token, elector]);

  // Optional: schedule auto-logout on token expiry using token exp claim
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const msLeft = (payload.exp * 1000) - Date.now();
      if (msLeft <= 0) { handleLogout(); return; }
      const t = setTimeout(() => { handleLogout(); }, msLeft);
      return () => clearTimeout(t);
    } catch (e) { /* ignore parse errors */ }
  }, [token]);

  const handleLogin = useCallback(({ token: newToken, elector: e }) => {
    setToken(newToken);
    if (e) setElector(e);
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
    setElector(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('elector');
    window.location.href = '/verify';
  }, []);

  return (
    <AuthContext.Provider value={{ token, elector, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

Usage in a component:
```js
function VerifyForm() {
  const { login } = useAuth();
  const [dni, setDni] = useState('');
  // on submit
  async function submit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/auth/verificar-elector?withElector=true', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, fecha_emision: '2020-01-15', codigo_verificador: '5' })
      });
      if (!res.ok) throw await res.json();
      const data = await res.json();
      login(data);
      // redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error verificando');
    }
  }
}
```

5) Errores y cómo mostrarlos al usuario
- 400: mostrar validación local (DNI 8 dígitos, fecha formato YYYY-MM-DD, código 1 dígito).
- 404: "Elector no encontrado" — mostrar pantalla con instrucciones (reintentar o contactar soporte).
- 503: "Servicio temporalmente no disponible" — sugerir intentar más tarde.
- 401 Token expired: redirigir a `/verify` o abrir modal para volver a verificar.

6) Seguridad y almacenamiento del token
- En producción, preferible usar cookies `HttpOnly` y `Secure` si controlas frontend + backend y quieres mitigar XSS. Aquí el backend entrega token en JSON; alternativas:
  - Guardar token en memoria (más seguro, no persistente) — buena para SPAs que no necesitan recuperación tras reload.
  - `sessionStorage` — persiste en pestaña/ventana, borrado al cerrar navegador.
  - Evita `localStorage` si XSS es una preocupación; si lo usas, aplica Content Security Policy y sanitización.

7) Pruebas manuales rápidas
- Verificar respuesta del endpoint `POST /api/v1/auth/verificar-elector?withElector=true` para DNI conocido.
- Guardar token devuelto y llamar `GET /api/v1/electores/mi-info` con header `Authorization: Bearer <TOKEN>`.

8) Consideraciones de UX
- `withElector=true` es recomendable para la primera verificación (UX fluida).
- Para acciones críticas (p. ej. votación), revalidar en cada operación.
- Mostrar tiempo restante de sesión (decodificando el `exp` del token) mejora la experiencia.

9) Problemas comunes y troubleshooting
- Si recibes "Unexpected token 'A'..." verifica que no estás enviando el token en el body. Usa headers.
- Si votacion-api devuelve 503, el backend reenvía 503; mostrar mensaje al usuario.

Si quieres, puedo:
- Generar una pequeña plantilla React (CRA/Vite) con `AuthProvider`, pantalla Verify y Dashboard ya conectados.
- Crear una colección Postman exportable con las requests listas.

Fin del documento.
