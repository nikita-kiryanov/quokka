-- Table: computer_games.games_to_game_genres

-- DROP TABLE IF EXISTS computer_games.games_to_game_genres;

CREATE TABLE IF NOT EXISTS computer_games.games_to_game_genres
(
    game_to_genre_id integer NOT NULL DEFAULT nextval('games_to_genres_game_to_genre_id_seq'::regclass),
    game_id integer,
    game_genre_name text COLLATE pg_catalog."default",
    CONSTRAINT game_to_genre_id_pkey PRIMARY KEY (game_to_genre_id),
    CONSTRAINT unique_combinations UNIQUE (game_id, game_genre_name),
    CONSTRAINT game_genre_name_fkey FOREIGN KEY (game_genre_name)
        REFERENCES computer_games.game_genres (game_genre_name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT game_id_fkey FOREIGN KEY (game_id)
        REFERENCES computer_games.games (game_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS computer_games.games_to_game_genres
    OWNER to postgres;