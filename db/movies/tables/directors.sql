-- Table: movies.directors

-- DROP TABLE IF EXISTS movies.directors;

CREATE TABLE IF NOT EXISTS movies.directors
(
    director_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT directors_pkey PRIMARY KEY (director_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS movies.directors
    OWNER to postgres;