-- Table: hot_sauces.sauces_to_peppers

-- DROP TABLE IF EXISTS hot_sauces.sauces_to_peppers;

CREATE TABLE IF NOT EXISTS hot_sauces.sauces_to_peppers
(
    sauce_to_pepper_id integer NOT NULL DEFAULT nextval('sauces_to_peppers_sauce_to_pepper_id_seq'::regclass),
    sauce_id integer NOT NULL,
    pepper_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT sauces_to_peppers_pkey PRIMARY KEY (sauce_to_pepper_id),
    CONSTRAINT sauces_to_peppers_unique UNIQUE (sauce_id, pepper_name),
    CONSTRAINT pepper_name_fkey FOREIGN KEY (pepper_name)
        REFERENCES hot_sauces.peppers (pepper_name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT sauce_id_fkey FOREIGN KEY (sauce_id)
        REFERENCES hot_sauces.sauces (sauce_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS hot_sauces.sauces_to_peppers
    OWNER to postgres;