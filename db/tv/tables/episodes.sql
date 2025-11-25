-- Table: tv.episodes

-- DROP TABLE IF EXISTS tv.episodes;

CREATE TABLE IF NOT EXISTS tv.episodes
(
    episode_id integer NOT NULL DEFAULT nextval('episodes_episode_id_seq'::regclass),
    show_id integer NOT NULL,
    season integer NOT NULL,
    episode integer NOT NULL,
    watched boolean DEFAULT false,
    CONSTRAINT episodes_pkey PRIMARY KEY (episode_id),
    CONSTRAINT show_season_episode_uniq UNIQUE (show_id, season, episode),
    CONSTRAINT show_id_fkey FOREIGN KEY (show_id)
        REFERENCES tv.shows (show_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS tv.episodes
    OWNER to postgres;