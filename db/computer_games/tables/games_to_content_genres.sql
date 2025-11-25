-- Table: computer_games.games_to_content_genres

-- DROP TABLE IF EXISTS computer_games.games_to_content_genres;

CREATE TABLE IF NOT EXISTS computer_games.games_to_content_genres
(
    games_to_content_genre_id integer NOT NULL DEFAULT nextval('games_to_content_genres_games_to_content_genre_id_seq'::regclass),
    game_id integer,
    content_genre_name text COLLATE pg_catalog."default",
    CONSTRAINT games_to_content_genre_id_pkey PRIMARY KEY (games_to_content_genre_id),
    CONSTRAINT unique_combinations2 UNIQUE (game_id, content_genre_name),
    CONSTRAINT content_genre_name_fkey FOREIGN KEY (content_genre_name)
        REFERENCES common.content_genres (content_genre_name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT game_id_fkey FOREIGN KEY (game_id)
        REFERENCES computer_games.games (game_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS computer_games.games_to_content_genres
    OWNER to postgres;