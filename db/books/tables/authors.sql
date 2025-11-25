-- Table: books.authors

-- DROP TABLE IF EXISTS books.authors;

CREATE TABLE IF NOT EXISTS books.authors
(
    author_id integer NOT NULL DEFAULT nextval('authors_author_id_seq'::regclass),
    author_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT authors_pkey PRIMARY KEY (author_id),
    CONSTRAINT authors_name_unique UNIQUE (author_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS books.authors
    OWNER to postgres;