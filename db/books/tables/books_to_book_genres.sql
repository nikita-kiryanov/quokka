-- Table: books.books_to_book_genres

-- DROP TABLE IF EXISTS books.books_to_book_genres;

CREATE TABLE IF NOT EXISTS books.books_to_book_genres
(
    book_to_genre_id integer NOT NULL DEFAULT nextval('books_to_book_genres_book_to_genre_id_seq'::regclass),
    book_id integer,
    book_genre_name text COLLATE pg_catalog."default",
    CONSTRAINT books_to_book_genres_pkey PRIMARY KEY (book_to_genre_id),
    CONSTRAINT books_to_book_genres_unique UNIQUE (book_id, book_genre_name),
    CONSTRAINT book_genre_name_fkey FOREIGN KEY (book_genre_name)
        REFERENCES books.book_genres (book_genre_name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT book_id_fkey FOREIGN KEY (book_id)
        REFERENCES books.books (book_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS books.books_to_book_genres
    OWNER to postgres;
