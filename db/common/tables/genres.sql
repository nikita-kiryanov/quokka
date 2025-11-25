-- Table: common.genres

-- DROP TABLE IF EXISTS common.genres;

CREATE TABLE IF NOT EXISTS common.genres
(
    genre_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT genre_name_pkey PRIMARY KEY (genre_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS common.genres
    OWNER to postgres;