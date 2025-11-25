-- FUNCTION: computer_games.developer_self_equivalency()

-- DROP FUNCTION IF EXISTS computer_games.developer_self_equivalency();

CREATE OR REPLACE FUNCTION computer_games.developer_self_equivalency()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    IF NEW.equivalency_group IS NULL THEN
        NEW.equivalency_group := NEW.developer_id;
    END IF;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION computer_games.developer_self_equivalency()
    OWNER TO postgres;
