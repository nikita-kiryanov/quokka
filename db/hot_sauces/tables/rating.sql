-- Table: hot_sauces.rating

-- DROP TABLE IF EXISTS hot_sauces.rating;

CREATE TABLE IF NOT EXISTS hot_sauces.rating
(
    rating text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT rating_pkey PRIMARY KEY (rating)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS hot_sauces.rating
    OWNER to postgres;