-- Table: books.books_to_content_genres

-- DROP TABLE IF EXISTS books.books_to_content_genres;

CREATE TABLE IF NOT EXISTS books.books_to_content_genres
(
    books_to_content_genre_id integer NOT NULL DEFAULT nextval('books_to_content_genres_books_to_content_genre_id_seq'::regclass),
    book_id integer,
    content_genre_name text COLLATE pg_catalog."default",
    CONSTRAINT books_to_content_genres_pkey PRIMARY KEY (books_to_content_genre_id),
    CONSTRAINT books_to_content_genres_unique UNIQUE (book_id, content_genre_name),
    CONSTRAINT content_genre_name_fkey FOREIGN KEY (content_genre_name)
        REFERENCES common.content_genres (content_genre_name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT book_id_fkey FOREIGN KEY (book_id)
        REFERENCES books.books (book_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS books.books_to_content_genres
    OWNER to postgres;