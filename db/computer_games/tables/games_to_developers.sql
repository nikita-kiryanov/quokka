-- Table: computer_games.games_to_developers

-- DROP TABLE IF EXISTS computer_games.games_to_developers;

CREATE TABLE IF NOT EXISTS computer_games.games_to_developers
(
    games_to_developer_id integer NOT NULL DEFAULT nextval('games_to_developers_games_to_developer_id_seq'::regclass),
    game_id integer,
    developer_id integer,
    CONSTRAINT games_to_developer_id_pkey PRIMARY KEY (games_to_developer_id),
    CONSTRAINT games_to_developers_unique UNIQUE (game_id, developer_id),
    CONSTRAINT developer_id_fkey FOREIGN KEY (developer_id)
        REFERENCES computer_games.developers (developer_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT game_id_fkey FOREIGN KEY (game_id)
        REFERENCES computer_games.games (game_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS computer_games.games_to_developers
    OWNER to postgres;