-- Table: common.franchise

-- DROP TABLE IF EXISTS common.franchise;

CREATE TABLE IF NOT EXISTS common.franchise
(
    franchise_id integer NOT NULL DEFAULT nextval('franchise_franchise_id_seq'::regclass),
    franchise_name text COLLATE pg_catalog."default",
    CONSTRAINT franchise_pkey PRIMARY KEY (franchise_id),
    CONSTRAINT franchise_name_unique UNIQUE (franchise_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS common.franchise
    OWNER to postgres;

COMMENT ON TABLE common.franchise
    IS 'A franchise is a collection of serieses. It contains things like:
* Primary series games
* Spinoff series games
* Standalone games that are not part of their own series
A franchise is usually named after the primary series.
Since a franchise can contain games that are not part of their own series, it is applied at the
level of games, not of series. The association with a series naturally emerges through the selection
of games that are assigned to franchises.';