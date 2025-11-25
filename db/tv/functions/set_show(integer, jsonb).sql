-- FUNCTION: tv.set_show(integer, jsonb)

-- DROP FUNCTION IF EXISTS tv.set_show(integer, jsonb);

CREATE OR REPLACE FUNCTION tv.set_show(
    v_show_id integer,
    v_data jsonb)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_series_name text;
    v_series_id integer;
    v_show_name text;
    v_ended boolean;
    v_input_genres text[];
BEGIN
    IF v_data ? 'shows' THEN
        v_series_name := NULLIF(trim(v_data->'shows'->>'series_name'), '');

        IF v_series_name IS NOT NULL THEN
            INSERT INTO series(series_name, tv)
            VALUES(v_series_name, true)
            ON CONFLICT(series_name)
            DO UPDATE
            SET tv = true
            RETURNING series_id
            INTO v_series_id;
        ELSE
            v_series_id := NULL;
        END IF;

        v_show_name := NULLIF(trim(v_data->'shows'->>'show'), '');
        v_ended := (v_data->'shows'->>'ended')::boolean;

        IF v_show_id IS NULL THEN
            INSERT INTO shows(series_id, show_name, ended)
            VALUES(v_series_id, v_show_name, v_ended)
            RETURNING show_id
            INTO v_show_id;
        ELSE
            UPDATE shows
            SET series_id = v_series_id,
                show_name = v_show_name,
                ended = v_ended
            WHERE show_id = v_show_id;
        END IF;
    END IF;

    IF v_data ? 'episodes' THEN
        INSERT INTO episodes(show_id, season, episode)
        SELECT v_show_id, (season_elem->>'season')::int, (episode_elem->>'episode')::int
        FROM jsonb_array_elements(v_data->'episodes') AS season_elem
        CROSS JOIN LATERAL jsonb_array_elements(season_elem->'episodes') AS episode_elem
        ON CONFLICT (show_id, season, episode)
        DO NOTHING;

        DELETE FROM episodes e
        WHERE e.show_id = v_show_id
        AND NOT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(v_data->'episodes') AS season_elem
            CROSS JOIN LATERAL jsonb_array_elements(season_elem->'episodes') AS episode_elem
            WHERE (season_elem->>'season')::int = e.season
            AND (episode_elem->>'episode')::int = e.episode
        );
    END IF;

    IF v_data ? 'shows_to_genres' THEN
        v_input_genres := ARRAY(
            SELECT DISTINCT trim(x)
            FROM jsonb_array_elements_text(
                COALESCE(
                    NULLIF(v_data->'shows_to_genres'->'genres', 'null'::jsonb),
                    '[]'::jsonb
                )
            ) AS t(x)
            WHERE NULLIF(trim(x), '') IS NOT NULL
        );

        DELETE FROM shows_to_genres stg
        WHERE stg.show_id = v_show_id
        AND NOT stg.genre_name = ANY(v_input_genres);

        INSERT INTO shows_to_genres (show_id, genre_name)
        SELECT v_show_id, genre_name
        FROM unnest(v_input_genres) AS t(genre_name)
        ON CONFLICT (show_id, genre_name) DO NOTHING;
    END IF;

    RETURN v_show_id;
END;
$BODY$;

ALTER FUNCTION tv.set_show(integer, jsonb)
    OWNER TO postgres;
