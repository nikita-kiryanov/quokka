-- Table: books.books_to_content_genres

-- DROP TABLE IF EXISTS books.books_to_content_genres;

CREATE TABLE IF NOT EXISTS books.books_to_content_genres
(
    books_to_content_genre_id integer NOT NULL DEFAULT nextval('books_to_content_genres_books_to_content_genre_id_seq'::regclass),
    book_id integer,
    content_genre_name text COLLATE pg_catalog."default",
    CONSTRAINT books_to_content_genres_pkey PRIMARY KEY (books_to_content_genre_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS books.books_to_content_genres
    OWNER to postgres;