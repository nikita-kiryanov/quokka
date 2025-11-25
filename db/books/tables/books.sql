-- Table: books.books

-- DROP TABLE IF EXISTS books.books;

CREATE TABLE IF NOT EXISTS books.books
(
    book_id integer NOT NULL DEFAULT nextval('books_book_id_seq'::regclass),
    book_name text COLLATE pg_catalog."default" NOT NULL,
    release_date date,
    series_id integer,
    read boolean DEFAULT false,
    comments text COLLATE pg_catalog."default",
    hidden boolean DEFAULT false,
    franchise_id integer,
    CONSTRAINT books_pkey PRIMARY KEY (book_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS books.books
    OWNER to postgres;