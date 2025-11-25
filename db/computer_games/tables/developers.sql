-- Table: computer_games.developers

-- DROP TABLE IF EXISTS computer_games.developers;

CREATE TABLE IF NOT EXISTS computer_games.developers
(
    developer_id integer NOT NULL DEFAULT nextval('developers_developer_id_seq'::regclass),
    developer_name text COLLATE pg_catalog."default" NOT NULL,
    info text COLLATE pg_catalog."default",
    defunct boolean DEFAULT false,
    equivalency_group integer,
    CONSTRAINT developers_pkey PRIMARY KEY (developer_id),
    CONSTRAINT unique_names UNIQUE (developer_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS computer_games.developers
    OWNER to postgres;

-- Trigger: set_default_equivalency_group

-- DROP TRIGGER IF EXISTS set_default_equivalency_group ON computer_games.developers;

CREATE OR REPLACE TRIGGER set_default_equivalency_group
    AFTER INSERT OR UPDATE
    ON computer_games.developers
    FOR EACH ROW
    EXECUTE FUNCTION computer_games.developer_self_equivalency();