-- Table: movies.movies_to_genres

-- DROP TABLE IF EXISTS movies.movies_to_genres;

CREATE TABLE IF NOT EXISTS movies.movies_to_genres
(
    movie_to_genre_id integer NOT NULL DEFAULT nextval('movies_to_genres_movie_to_genre_id_seq'::regclass),
    movie_id integer,
    genre_name text COLLATE pg_catalog."default",
    CONSTRAINT movies_to_genres_pkey PRIMARY KEY (movie_to_genre_id),
    CONSTRAINT movies_to_genres_unique UNIQUE (movie_id, genre_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS movies.movies_to_genres
    OWNER to postgres;