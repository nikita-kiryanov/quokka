-- Table: hot_sauces.sauces

-- DROP TABLE IF EXISTS hot_sauces.sauces;

CREATE TABLE IF NOT EXISTS hot_sauces.sauces
(
    sauce_id integer NOT NULL DEFAULT nextval('sauces_sauce_id_seq'::regclass),
    sauce_name text COLLATE pg_catalog."default" NOT NULL,
    brand_name text COLLATE pg_catalog."default" NOT NULL,
    comments text COLLATE pg_catalog."default",
    rating text COLLATE pg_catalog."default",
    CONSTRAINT sauces_pkey PRIMARY KEY (sauce_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS hot_sauces.sauces
    OWNER to postgres;