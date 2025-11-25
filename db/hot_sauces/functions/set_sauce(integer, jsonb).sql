-- FUNCTION: hot_sauces.set_sauce(integer, jsonb)

-- DROP FUNCTION IF EXISTS hot_sauces.set_sauce(integer, jsonb);

CREATE OR REPLACE FUNCTION hot_sauces.set_sauce(
    v_sauce_id integer,
    v_data jsonb)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_sauce_name text;
    v_brand_name text;
    v_rating text;
    v_input_peppers text[];
BEGIN
    IF v_data ? 'sauces' THEN
        v_brand_name := NULLIF(trim(v_data->'sauces'->>'brand_name'), '');

        IF v_brand_name IS NOT NULL THEN
            INSERT INTO brand(brand_name)
            VALUES (v_brand_name)
            ON CONFLICT (brand_name) DO NOTHING;
        END IF;

        v_sauce_name := NULLIF(trim(v_data->'sauces'->>'sauce_name'), '');
        v_rating := NULLIF(trim(v_data->'sauces'->>'rating'), '');

        IF v_sauce_id IS NULL THEN
            INSERT INTO sauces(sauce_name, brand_name, comments, rating)
            VALUES (v_sauce_name, v_brand_name, v_data->'sauces'->>'comments', v_rating)
            RETURNING sauce_id
            INTO v_sauce_id;
        ELSE
            UPDATE sauces
            SET sauce_name = v_sauce_name,
                brand_name = v_brand_name,
                comments = v_data->'sauces'->>'comments',
                rating = v_rating
            WHERE sauce_id = v_sauce_id;
        END IF;
    END IF;

    IF v_data ? 'sauces_to_peppers' THEN
        INSERT INTO peppers(pepper_name)
        SELECT DISTINCT trim(x)
        FROM jsonb_array_elements_text(v_data->'sauces_to_peppers'->'peppers') AS t(x)
        WHERE NULLIF(trim(x), '') IS NOT NULL
        ON CONFLICT (pepper_name) DO NOTHING;

        v_input_peppers := ARRAY(
            SELECT DISTINCT trim(x)
            FROM jsonb_array_elements_text(
                COALESCE(
                    NULLIF(v_data->'sauces_to_peppers'->'peppers', 'null'::jsonb),
                    '[]'::jsonb
                )
            ) AS t(x)
            WHERE NULLIF(trim(x), '') IS NOT NULL
        );

        DELETE FROM sauces_to_peppers stp
        WHERE stp.sauce_id = v_sauce_id AND NOT stp.pepper_name = ANY(v_input_peppers);

        INSERT INTO sauces_to_peppers(sauce_id, pepper_name)
        SELECT v_sauce_id, pepper_name
        FROM unnest(v_input_peppers) AS t(pepper_name)
        ON CONFLICT (sauce_id, pepper_name) DO NOTHING;
    END IF;

    RETURN v_sauce_id;
END;
$BODY$;

ALTER FUNCTION hot_sauces.set_sauce(integer, jsonb)
    OWNER TO postgres;
