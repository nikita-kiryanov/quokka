-- Table: books.book_genres

-- DROP TABLE IF EXISTS books.book_genres;

CREATE TABLE IF NOT EXISTS books.book_genres
(
    book_genre_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT book_genres_pkey PRIMARY KEY (book_genre_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS books.book_genres
    OWNER to postgres;
