-- elecciones.cronograma definition

-- Drop table

-- DROP TABLE elecciones.cronograma;

CREATE TABLE elecciones.cronograma (
	id bigserial NOT NULL,
	fecha timestamptz NOT NULL,
	evento text NOT NULL,
	es_para_mm bool NOT NULL,
	CONSTRAINT cronograma_pk PRIMARY KEY (id)
);


-- elecciones.electores definition

-- Drop table

-- DROP TABLE elecciones.electores;

CREATE TABLE elecciones.electores (
	dni text NOT NULL,
	lugar_ubicacion text NOT NULL,
	es_miembro_de_mesa bool NOT NULL,
	CONSTRAINT electores_pk PRIMARY KEY (dni),
	fecha_emision date NOT NULL,
	codigo_verificacion text NOT NULL
);


-- elecciones.partidos definition

-- Drop table

-- DROP TABLE elecciones.partidos;

CREATE TABLE elecciones.partidos (
	id bigserial NOT NULL,
	nombre varchar(150) NOT NULL,
	sigla varchar(20) NULL,
	logo_url text NULL,
	descripcion_corta text NULL,
	fundacion date NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT partidos_pkey PRIMARY KEY (id),
	CONSTRAINT uq_partidos_nombre UNIQUE (nombre)
);


-- elecciones.periodos_electorales definition

-- Drop table

-- DROP TABLE elecciones.periodos_electorales;

CREATE TABLE elecciones.periodos_electorales (
	id bigserial NOT NULL,
	anio int4 NOT NULL,
	tipo varchar(50) NOT NULL,
	descripcion text NULL,
	created_at timestamp DEFAULT now() NULL,
	CONSTRAINT periodos_electorales_pkey PRIMARY KEY (id),
	CONSTRAINT uq_periodo_anio_tipo UNIQUE (anio, tipo)
);


-- elecciones.miembros definition

-- Drop table

-- DROP TABLE elecciones.miembros;

CREATE TABLE elecciones.miembros (
	id bigserial NOT NULL,
	tipo_miembro text NOT NULL,
	nombre_completo text NOT NULL,
	fecha_nacimiento date NOT NULL,
	sexo bool NOT NULL,
	id_pp bigserial NOT NULL,
	CONSTRAINT miembros_pk PRIMARY KEY (id),
	CONSTRAINT fk_id_pp FOREIGN KEY (id_pp) REFERENCES elecciones.partidos(id)
);
CREATE INDEX fki_fk_id_pp ON elecciones.miembros USING btree (id_pp);


-- elecciones.planes_gobierno definition

-- Drop table

-- DROP TABLE elecciones.planes_gobierno;

CREATE TABLE elecciones.planes_gobierno (
	id bigserial NOT NULL,
	partido_id int8 NOT NULL,
	periodo_id int8 NULL,
	resumen text NULL,
	pdf_url text NULL,
	anio int4 NULL,
	"version" varchar(20) NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT planes_gobierno_pkey PRIMARY KEY (id),
	CONSTRAINT uq_plan_partido_periodo UNIQUE (partido_id, periodo_id),
	CONSTRAINT fk_plan_partido FOREIGN KEY (partido_id) REFERENCES elecciones.partidos(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_plan_periodo FOREIGN KEY (periodo_id) REFERENCES elecciones.periodos_electorales(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX idx_planes_partido_id ON elecciones.planes_gobierno USING btree (partido_id);
CREATE INDEX idx_planes_periodo_id ON elecciones.planes_gobierno USING btree (periodo_id);


-- elecciones.indicadores_plan_gobierno definition

-- Drop table

-- DROP TABLE elecciones.indicadores_plan_gobierno;

CREATE TABLE elecciones.indicadores_plan_gobierno (
	id int8 DEFAULT nextval('elecciones.indicadores_partidos_id_seq'::regclass) NOT NULL,
	partido_politico text NULL,
	edu text NULL,
	sal text NULL,
	seg text NULL,
	eco text NULL,
	est text NULL,
	soc text NULL,
	med text NULL,
	inf text NULL,
	cul text NULL,
	agr text NULL,
	tec text NULL,
	ext text NULL,
	otr text NULL,
	id_plan_gobierno bigserial NOT NULL,
	CONSTRAINT indicadores_partidos_pkey PRIMARY KEY (id),
	CONSTRAINT fk_id_plan_gobierno FOREIGN KEY (id_plan_gobierno) REFERENCES elecciones.planes_gobierno(id)
);
