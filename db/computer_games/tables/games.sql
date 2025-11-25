-- Table: computer_games.games

-- DROP TABLE IF EXISTS computer_games.games;

CREATE TABLE IF NOT EXISTS computer_games.games
(
    game_id integer NOT NULL DEFAULT nextval('games_game_id_seq'::regclass),
    game_name text COLLATE pg_catalog."default" NOT NULL,
    dlc_for integer,
    series_id integer,
    initial_release_date date,
    played boolean DEFAULT false,
    comments text COLLATE pg_catalog."default",
    hidden boolean DEFAULT false,
    remake_for integer,
    chronology_date date,
    franchise_id integer,
    CONSTRAINT games_pkey PRIMARY KEY (game_id),
    CONSTRAINT franchise_id_fkey FOREIGN KEY (franchise_id)
        REFERENCES common.franchise (franchise_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT games_parent_id_fkey FOREIGN KEY (dlc_for)
        REFERENCES computer_games.games (game_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT games_remake_id_fkey FOREIGN KEY (remake_for)
        REFERENCES computer_games.games (game_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT games_series_id_fkey FOREIGN KEY (series_id)
        REFERENCES common.series (series_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS computer_games.games
    OWNER to postgres;

COMMENT ON COLUMN computer_games.games.chronology_date
    IS 'The initial release date represents the actual release date of the game. The chronology date
represents the release date of the game in the series chronology. For example, Resident Evil 4 was
released in 2005, and a remake was released in 2023. The initial release date of each game is
whatever year it was released on, but the chronology date of both games is 2005, the date on which
the 4th entry in the Resident Evil series was first released. Chronology date can be useful for
grouping a game and its remake together, while still retaining the data about the actual release date.';

COMMENT ON COLUMN computer_games.games.franchise_id
    IS 'A franchise is like a meta-series. It can include multiple series, and will usually be named after
the primary series. Its purpose is to aggregate related series under the same umbrella in cases when
a series becomes so successful that it spawns multiple spinoffs. For example, the Zork series has a
spinoff called the Enchanter trilogy. For convenience we want to categorize both under Zork, but
retain the fact that these are separate series.';

-- Trigger: auto_set_chronology_date

-- DROP TRIGGER IF EXISTS auto_set_chronology_date ON computer_games.games;

CREATE OR REPLACE TRIGGER auto_set_chronology_date
    BEFORE INSERT OR UPDATE
    ON computer_games.games
    FOR EACH ROW
    EXECUTE FUNCTION computer_games.auto_set_chronology_date();