-- Table: movies.movies_to_directors

-- DROP TABLE IF EXISTS movies.movies_to_directors;

CREATE TABLE IF NOT EXISTS movies.movies_to_directors
(
    movie_to_director_id integer NOT NULL DEFAULT nextval('movies_to_directors_movie_to_director_id_seq'::regclass),
    movie_id integer,
    director_name text COLLATE pg_catalog."default",
    CONSTRAINT movies_to_directors_pkey PRIMARY KEY (movie_to_director_id),
    CONSTRAINT movies_to_directors_unique UNIQUE (movie_id, director_name),
    CONSTRAINT director_name_fkey FOREIGN KEY (director_name)
        REFERENCES movies.directors (director_name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT movie_id_fkey FOREIGN KEY (movie_id)
        REFERENCES movies.movies (movie_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS movies.movies_to_directors
    OWNER to postgres;