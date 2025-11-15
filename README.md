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

Notas importantes sobre verificación de electores y hashing
- En la especificación los `dni` y el `digito verificador` estarán hasheados en la DB (columnas `dni` y `codigo_verificacion` en el esquema provisto).
- Para verificar un elector, el backend compara el `dni` y el `dv` recibidos en texto plano contra los hashes almacenados usando `bcrypt.compare`.
-- Debido a la naturaleza de los hashes con salt, la implementación puede leer filas candidatas y comparar con `bcrypt.compare` hasta encontrar coincidencia. Esto funciona pero no escala bien para tablas grandes.
-- Mejora recomendada: habilitar la extensión `pgcrypto` en PostgreSQL y almacenar los hashes en un formato compatible con `crypt()` (bcrypt con crypt). Con `pgcrypto` la comparación puede hacerse en el servidor: `WHERE crypt($1, dni) = dni` y `WHERE crypt($2, codigo_verificacion) = codigo_verificacion`, evitando traer filas al servidor.
-- Aún mejor (indexable): almacenar además una huella determinística (por ejemplo HMAC con una clave secreta del servidor) para búsqueda por índice y usar bcrypt/crypt sólo para validación final.

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
- POST /api/v1/auth/verificar-elector  -> { dni, dv }
- Guardar token devuelto y usar en headers: Authorization: Bearer <token>

Limitaciones demo
- Las búsquedas por valores hasheados usan `bcrypt.compare` y escanean filas filtradas por fecha u otra columna; para tablas grandes optimizar con HMAC o campo indexado determinístico.
# Pentacode_Backend