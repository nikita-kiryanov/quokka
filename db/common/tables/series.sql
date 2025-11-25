-- Table: common.series

-- DROP TABLE IF EXISTS common.series;

CREATE TABLE IF NOT EXISTS common.series
(
    series_id integer NOT NULL DEFAULT nextval('series_series_id_seq'::regclass),
    series_name text COLLATE pg_catalog."default",
    spinoff_for integer,
    computer_games boolean,
    movies boolean,
    books boolean,
    tv boolean,
    CONSTRAINT series_pkey PRIMARY KEY (series_id),
    CONSTRAINT name_unique UNIQUE (series_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS common.series
    OWNER to postgres;