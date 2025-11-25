-- Table: common.lists

-- DROP TABLE IF EXISTS common.lists;

CREATE TABLE IF NOT EXISTS common.lists
(
    list_item_id integer NOT NULL DEFAULT nextval('lists_list_item_id_seq'::regclass),
    type text COLLATE pg_catalog."default" NOT NULL,
    list_name text COLLATE pg_catalog."default" NOT NULL,
    list_item text COLLATE pg_catalog."default" NOT NULL,
    list_item_type text COLLATE pg_catalog."default" NOT NULL,
    sort integer NOT NULL,
    CONSTRAINT lists_pkey PRIMARY KEY (list_item_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS common.lists
    OWNER to postgres;