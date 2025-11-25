-- Table: books.books_to_authors

-- DROP TABLE IF EXISTS books.books_to_authors;

CREATE TABLE IF NOT EXISTS books.books_to_authors
(
    books_to_authors_id integer NOT NULL DEFAULT nextval('books_to_authors_books_to_authors_id_seq'::regclass),
    book_id integer,
    author_id integer,
    CONSTRAINT books_to_authors_pkey PRIMARY KEY (books_to_authors_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS books.books_to_authors
    OWNER to postgres;