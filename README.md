# Sistema de Información Electoral - Backend

Proyecto demo: Node.js + Express + PostgreSQL para consultas electorales.

Características principales:
- Arquitectura MVC
- PostgreSQL con `pg` y Pool de conexiones
- Variables de entorno con `dotenv`
- CORS habilitado
- Manejo de errores centralizado
- JWT para tokens de 5 minutos

Instalación
1. Copia `.env.example` a `.env` y completa tus datos.
2. Instala dependencias:

```
npm install
```

3. Ejecuta en modo desarrollo:

```
npm run dev
```

Notas importantes sobre verificación de electores
- Según la última instrucción del proyecto, la verificación de electores se realiza por coincidencia exacta de los tres valores: `dni`, `fecha_emision` y `codigo_verificacion` (tal como están en el esquema `elecciones.electores`).
- Endpoint: `POST /api/v1/auth/verificar-elector` espera `{ dni, dv, fecha_emision }` y devuelve un token si los tres campos coinciden exactamente con un registro en la base de datos.
- Seguridad: esta estrategia funciona para consultas directas pero NO es recomendada para producción si los datos personales se almacenan en texto plano. Para mayor seguridad y rendimiento en producción considerar:
  - Almacenar hashes y usar `bcrypt`/`pgcrypto` para validación.
  - Añadir una huella determinística indexable (HMAC) para búsquedas eficientes, y usar bcrypt/crypt sólo para validación final.
 - Nota sobre el token: el JWT devuelto contiene los campos `{ electorDni, electorDv, electorFecha }` y expira en 5 minutos. Los endpoints protegidos reutilizan estos valores para re-validar al elector utilizando `findByDniFechaDv`.

Estructura de carpetas

```
src/
├── controllers/
├── routes/
├── models/
├── services/
├── middleware/
├── config/
├── utils/
└── app.js
```

Base de datos (esquema mínimo de ejemplo)

```sql
-- tabla partidos
CREATE TABLE partidos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  plan TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- tabla postulantes
CREATE TABLE postulantes (
  id SERIAL PRIMARY KEY,
  partido_id INTEGER REFERENCES partidos(id),
  nombre TEXT,
  cargo TEXT
);

-- tabla electores (ejemplo según el SQL en el repo: las columnas están en el esquema `elecciones`)
CREATE TABLE elecciones.electores (
  dni text NOT NULL PRIMARY KEY, -- aquí se almacena el hash del dni
  lugar_ubicacion text NOT NULL,
  es_miembro_de_mesa bool NOT NULL,
  fecha_emision date NOT NULL,
  codigo_verificacion text NOT NULL -- hash del dígito verificador
);

-- tabla mesas (ubicación)
CREATE TABLE mesas (
  id SERIAL PRIMARY KEY,
  direccion TEXT,
  distrito TEXT,
  coords JSONB
);

-- tabla cronograma
CREATE TABLE cronograma (
  id SERIAL PRIMARY KEY,
  titulo TEXT,
  descripcion TEXT,
  fecha TIMESTAMP,
  es_para_mm BOOLEAN DEFAULT false
);
```

Uso rápido
-- POST /api/v1/auth/verificar-elector  -> { dni, dv, fecha_emision }
- Guardar token devuelto y usar en headers: Authorization: Bearer <token>

Limitaciones demo
- Las búsquedas por valores hasheados usan `bcrypt.compare` y escanean filas filtradas por fecha u otra columna; para tablas grandes optimizar con HMAC o campo indexado determinístico.
# Pentacode_Backend