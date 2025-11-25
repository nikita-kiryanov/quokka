-- Table: hot_sauces.peppers

-- DROP TABLE IF EXISTS hot_sauces.peppers;

CREATE TABLE IF NOT EXISTS hot_sauces.peppers
(
    pepper_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT peppers_pkey PRIMARY KEY (pepper_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS hot_sauces.peppers
    OWNER to postgres;