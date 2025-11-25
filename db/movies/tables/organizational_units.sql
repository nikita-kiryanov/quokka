-- Table: movies.organizational_units

-- DROP TABLE IF EXISTS movies.organizational_units;

CREATE TABLE IF NOT EXISTS movies.organizational_units
(
    organizational_unit_id integer NOT NULL DEFAULT nextval('organizational_units_organizational_unit_id_seq'::regclass),
    movie_id integer,
    organization text COLLATE pg_catalog."default",
    CONSTRAINT organizational_units_pkey PRIMARY KEY (organizational_unit_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS movies.organizational_units
    OWNER to postgres;