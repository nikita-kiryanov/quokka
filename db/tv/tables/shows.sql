-- Table: tv.shows

-- DROP TABLE IF EXISTS tv.shows;

CREATE TABLE IF NOT EXISTS tv.shows
(
    show_id integer NOT NULL DEFAULT nextval('shows_show_id_seq'::regclass),
    show_name text COLLATE pg_catalog."default" NOT NULL,
    series_id integer,
    ended boolean DEFAULT false,
    start_year integer,
    end_year integer,
    CONSTRAINT shows_pkey PRIMARY KEY (show_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS tv.shows
    OWNER to postgres;