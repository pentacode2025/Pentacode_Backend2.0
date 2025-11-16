*Autenticación y flujo de verificación de electores**

Resumen
- **Propósito**: Permitir que un usuario verifique su identidad (DNI + fecha de emisión + código verificador) usando la `votacion-api`, crear una sesión corta (JWT 5 minutos) y, mientras la sesión esté vigente, obtener su información de elector (nombre, dirección, coordenadas, mesa, si es miembro de mesa, etc.).

Endpoints
- **POST** `/api/v1/auth/verificar-elector` : verificar credenciales del documento y emitir token.
  - Body (JSON):
    - `dni` (string, 8 dígitos) — obligatorio
    - `fecha_emision` (string, `YYYY-MM-DD`) — obligatorio
    - `codigo_verificador` o `dv` (string, 1 dígito) — obligatorio
    - `withElector` (opcional, boolean o 'true'/'1') — si se envía, la respuesta incluirá también el objeto `elector`.
  - Query opcional: `?withElector=true` equivalente a incluirlo en el body.
  - Respuestas:
    - 200 OK: `{ token: string, expiresIn: '5m' }` o `{ token, expiresIn, elector }` si se pidió `withElector`.
    - 400 Bad Request: falta/invalid input (dni, fecha_emision o dv inválidos).
    - 404 Not Found: elector no encontrado.
    - 503 Service Unavailable: `votacion-api` inaccesible o error 5xx.

- **GET** `/api/v1/electores/mi-info` : obtener información mapeada del elector (protegido).
  - Headers: `Authorization: Bearer <TOKEN>` (obligatorio)
  - Respuestas:
    - 200 OK: objeto `elector` mapeado: `dni, nombre, lugar_ubicacion, direccion, latitud, longitud, mesa, pabellon, es_miembro_de_mesa, fecha_emision, codigo_verificacion, raw`.
    - 401 Unauthorized: `Missing Authorization header`, `Invalid token`, o `Token expired`.
    - 404 Not Found: elector no encontrado.
    - 503 Service Unavailable: `votacion-api` error.

Ejemplos de uso

1) Obtener token (y opcionalmente datos del elector)

curl (Linux / macOS / Git Bash):
```bash
curl -i -X POST "http://localhost:3000/api/v1/auth/verificar-elector?withElector=true" \
  -H "Content-Type: application/json" \
  -d '{"dni":"12345678","fecha_emision":"2020-01-15","codigo_verificador":"5"}'
```

PowerShell (Windows) usando `Invoke-RestMethod`:
```powershell
$body = @{ dni='12345678'; fecha_emision='2020-01-15'; codigo_verificador='5' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3000/api/v1/auth/verificar-elector?withElector=true' -Method POST -Body $body -ContentType 'application/json'
```

Ejemplo de respuesta (200):
```json
{
  "token": "eyJ...",
  "expiresIn": "5m",
  "elector": {
    "dni": "12345678",
    "nombre": "Pedro Sánchez",
    "lugar_ubicacion": "IE 3054 República...",
    "direccion": "Av. Los Álamos 123",
    "latitud": -12.0464,
    "longitud": -77.0428,
    "mesa": "12",
    "pabellon": "A",
    "es_miembro_de_mesa": false,
    "fecha_emision": "2020-01-15",
    "codigo_verificacion": "5",
    "raw": { /* datos originales de la votacion-api */ }
  }
}
```

2) Usar el token para obtener la información protegida (`mi-info`)

curl:
```bash
curl -i -X GET "http://localhost:3000/api/v1/electores/mi-info" -H "Authorization: Bearer <TOKEN>"
```

PowerShell:
```powershell
 $token = '<TOKEN>'
 Invoke-RestMethod -Uri 'http://localhost:3000/api/v1/electores/mi-info' -Method GET -Headers @{ Authorization = "Bearer $token" }
```

JavaScript (axios):
```js
const axios = require('axios');
const token = '<TOKEN>';
axios.get('http://localhost:3000/api/v1/electores/mi-info', { headers: { Authorization: `Bearer ${token}` } })
  .then(r => console.log(r.data))
  .catch(e => console.error(e.response ? e.response.data : e.message));
```

JavaScript (fetch):
```js
fetch('http://localhost:3000/api/v1/electores/mi-info', { headers: { Authorization: 'Bearer <TOKEN>' } })
  .then(r => r.json()).then(console.log).catch(console.error);
```

Errores comunes y soluciones
- "Unexpected token 'A', \"Authorizat\"... is not valid JSON": esto ocurre cuando el cuerpo de la petición contiene literalmente `Authorization: Bearer ...` (p. ej. pegaste el token en el campo Body en Postman en vez de usar la pestaña `Auth` o agregarlo en `Headers`).
  - Solución: eliminar el Body y poner el token en `Auth -> Bearer Token` o en `Headers` con clave `Authorization`.
- 401 `Token expired`: el token tiene 5 minutos de validez; al expirar el servidor responde 401 con el mensaje `Token expired`. El frontend debe redirigir al usuario a la pantalla inicial para volver a verificar su documento.
- 503 `votacion-api service error`: la `votacion-api` no responde o devuelve 5xx; el cliente debe mostrar un mensaje de servicio temporalmente no disponible.

Buenas prácticas recomendadas
- Nunca enviar el token en el cuerpo del request. Usar siempre `Authorization: Bearer <token>` en headers.
- Si quieres evitar dos llamadas (verificar + obtener `mi-info`) el cliente puede pedir `withElector=true` al verificar y recibir el `elector` junto con el `token`.
- Implementar en frontend manejo de 401: si el servidor responde 401 con `Token expired`, redirigir a la pantalla de verificación; si es `Invalid token`, pedir re-autenticación.
- Mantener la `votacion-api` como fuente de verdad: el backend reconsulta para devolver datos actualizados; por eso puede haber dos llamadas en el flujo (verificar -> token, luego mi-info con token).

Resumen rápido de mensajes y códigos HTTP
- 200 OK: operación exitosa (token y/o elector)
- 400 Bad Request: input inválido
- 401 Unauthorized: falta/invalid token o `Token expired`
- 404 Not Found: elector no encontrado
- 503 Service Unavailable: error en `votacion-api`

Ficheros relevantes en este repositorio
- `src/controllers/auth.controller.js` — endpoint `verificar-elector` y `withElector` option.
- `src/models/elector.model.js` — consulta a `votacion-api` y mapeo de respuesta.
- `src/middleware/auth.middleware.js` — extracción/verificación del token y mensajes de error (`Token expired`).

Si quieres, puedo añadir un ejemplo de Postman exportable (collection) o un pequeño snippet de frontend (React) que implemente la redirección automática cuando el token expire.
