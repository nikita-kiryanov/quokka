-- FUNCTION: computer_games.auto_set_chronology_date()

-- DROP FUNCTION IF EXISTS computer_games.auto_set_chronology_date();

CREATE OR REPLACE FUNCTION computer_games.auto_set_chronology_date()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    IF NEW.chronology_date IS NULL THEN
        NEW.chronology_date := NEW.initial_release_date;
    END IF;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION computer_games.auto_set_chronology_date()
    OWNER TO postgres;
