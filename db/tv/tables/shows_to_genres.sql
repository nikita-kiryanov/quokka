-- Table: tv.shows_to_genres

-- DROP TABLE IF EXISTS tv.shows_to_genres;

CREATE TABLE IF NOT EXISTS tv.shows_to_genres
(
    show_to_genre_id integer NOT NULL DEFAULT nextval('shows_to_genres_show_to_genre_id_seq'::regclass),
    show_id integer,
    genre_name text COLLATE pg_catalog."default",
    CONSTRAINT shows_to_genres_pkey PRIMARY KEY (show_to_genre_id),
    CONSTRAINT shows_to_genres_unique UNIQUE (show_id, genre_name),
    CONSTRAINT show_id_fkey FOREIGN KEY (show_id)
        REFERENCES tv.shows (show_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS tv.shows_to_genres
    OWNER to postgres;