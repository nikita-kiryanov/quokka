-- Table: movies.movies

-- DROP TABLE IF EXISTS movies.movies;

CREATE TABLE IF NOT EXISTS movies.movies
(
    movie_id integer NOT NULL DEFAULT nextval('movies_movie_id_seq'::regclass),
    movie_name text COLLATE pg_catalog."default" NOT NULL,
    series_id integer,
    release_date date,
    watched boolean DEFAULT false,
    comments text COLLATE pg_catalog."default",
    hidden boolean DEFAULT false,
    CONSTRAINT movies_pkey PRIMARY KEY (movie_id),
    CONSTRAINT movies_series_id_fkey FOREIGN KEY (series_id)
        REFERENCES common.series (series_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS movies.movies
    OWNER to postgres;