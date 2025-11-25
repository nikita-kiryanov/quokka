-- Table: computer_games.game_genres

-- DROP TABLE IF EXISTS computer_games.game_genres;

CREATE TABLE IF NOT EXISTS computer_games.game_genres
(
    game_genre_name text COLLATE pg_catalog."default" NOT NULL,
    parent text COLLATE pg_catalog."default",
    CONSTRAINT game_genres_pkey PRIMARY KEY (game_genre_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS computer_games.game_genres
    OWNER to postgres;