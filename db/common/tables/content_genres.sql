-- Table: common.content_genres

-- DROP TABLE IF EXISTS common.content_genres;

CREATE TABLE IF NOT EXISTS common.content_genres
(
    content_genre_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT content_genres_pkey PRIMARY KEY (content_genre_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS common.content_genres
    OWNER to postgres;