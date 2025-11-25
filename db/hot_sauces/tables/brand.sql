-- Table: hot_sauces.brand

-- DROP TABLE IF EXISTS hot_sauces.brand;

CREATE TABLE IF NOT EXISTS hot_sauces.brand
(
    brand_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT brand_pkey PRIMARY KEY (brand_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS hot_sauces.brand
    OWNER to postgres;