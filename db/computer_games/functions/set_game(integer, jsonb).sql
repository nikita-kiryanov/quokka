-- FUNCTION: computer_games.set_game(integer, jsonb)

-- DROP FUNCTION IF EXISTS computer_games.set_game(integer, jsonb);

CREATE OR REPLACE FUNCTION computer_games.set_game(
    v_game_id integer,
    v_data jsonb)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_series_name text;
    v_series_id integer;
    v_franchise_name text;
    v_franchise_id integer;
    v_dlc_for text;
    v_dlc_for_id integer;
    v_dlc_for_match text[];
    v_remake_for text;
    v_remake_for_id integer;
    v_remake_for_match text[];
    v_game_name text;
    v_current_developers text[];
    v_input_developer_ids integer[];
    v_input_game_genres text[];
    v_input_content_genres text[];
BEGIN
    IF v_data ? 'games' THEN
        v_series_name := NULLIF(trim(v_data->'games'->>'series_name'), '');

        IF v_series_name IS NOT NULL THEN
            INSERT INTO series (series_name, computer_games)
            VALUES (v_data->'games'->>'series_name', true)
            ON CONFLICT (series_name)
            DO UPDATE
            SET computer_games = true
            RETURNING series_id
            INTO v_series_id;
        ELSE
            v_series_id := NULL;
        END IF;

        v_franchise_name := NULLIF(trim(v_data->'games'->>'franchise_name'), '');

        IF v_franchise_name IS NOT NULL THEN
            INSERT INTO franchise (franchise_name)
            VALUES (v_franchise_name)
            ON CONFLICT (franchise_name)
            DO UPDATE
            SET franchise_name = EXCLUDED.franchise_name
            RETURNING franchise_id
            INTO v_franchise_id;
        ELSE
            v_franchise_id := NULL;
        END IF;

        v_dlc_for := NULLIF(trim(v_data->'games'->>'dlc_for'), '');

        IF v_dlc_for IS NOT NULL THEN
            -- Matches "game name (year)", capturing the name and the 4-digit year separately
            -- so a game can be disambiguated from other games sharing the same name.
            v_dlc_for_match := regexp_match(v_dlc_for, '^(.*?)\s*\((\d{4})\)$');

            IF v_dlc_for_match IS NOT NULL THEN
                SELECT game_id
                INTO v_dlc_for_id
                FROM games
                WHERE game_name = v_dlc_for_match[1]
                    AND EXTRACT(YEAR FROM initial_release_date) = v_dlc_for_match[2]::integer
                    AND game_id IS DISTINCT FROM v_game_id;
            ELSE
                SELECT game_id
                INTO v_dlc_for_id
                FROM games
                WHERE game_name = v_dlc_for AND game_id IS DISTINCT FROM v_game_id;
            END IF;
        ELSE
            v_dlc_for_id := NULL;
        END IF;

        v_remake_for := NULLIF(trim(v_data->'games'->>'remake_for'), '');

        IF v_remake_for IS NOT NULL THEN
            -- Matches "game name (year)", capturing the name and the 4-digit year separately
            -- so a remake can be disambiguated from other games sharing the same name.
            v_remake_for_match := regexp_match(v_remake_for, '^(.*?)\s*\((\d{4})\)$');

            IF v_remake_for_match IS NOT NULL THEN
                SELECT game_id
                INTO v_remake_for_id
                FROM games
                WHERE game_name = v_remake_for_match[1]
                    AND EXTRACT(YEAR FROM initial_release_date) = v_remake_for_match[2]::integer
                    AND game_id IS DISTINCT FROM v_game_id;
            ELSE
                SELECT game_id
                INTO v_remake_for_id
                FROM games
                WHERE game_name = v_remake_for AND game_id IS DISTINCT FROM v_game_id;
            END IF;
        ELSE
            v_remake_for_id := NULL;
        END IF;

        v_game_name := NULLIF(trim(v_data->'games'->>'game_name'), '');

        IF v_game_id IS NULL THEN
            INSERT INTO games (
                franchise_id, series_id, game_name, dlc_for, remake_for, initial_release_date, played,
                comments, chronology_date
            )
            VALUES (
                v_franchise_id, v_series_id, v_game_name, v_dlc_for_id, v_remake_for_id,
                (v_data->'games'->>'initial_release_date')::date, (v_data->'games'->>'played')::boolean,
                v_data->'games'->>'comments', (v_data->'games'->>'chronology_date')::date
            )
            RETURNING game_id
            INTO v_game_id;
        ELSE
            UPDATE games
            SET franchise_id = v_franchise_id,
                series_id = v_series_id,
                game_name = v_game_name,
                dlc_for = v_dlc_for_id,
                remake_for = v_remake_for_id,
                initial_release_date = (v_data->'games'->>'initial_release_date')::date,
                played = (v_data->'games'->>'played')::boolean,
                comments = v_data->'games'->>'comments',
                chronology_date = (v_data->'games'->>'chronology_date')::date
            WHERE game_id = v_game_id;
        END IF;
    END IF;

    IF v_data ? 'games_to_developers' THEN
        INSERT INTO developers (developer_name)
        SELECT DISTINCT trim(x)
        FROM jsonb_array_elements_text(v_data->'games_to_developers'->'developers') AS t(x)
        WHERE NULLIF(trim(x), '') IS NOT NULL
        ON CONFLICT (developer_name) DO NOTHING;

        SELECT COALESCE(array_agg(d.developer_id), ARRAY[]::integer[])
        INTO v_input_developer_ids
        FROM developers d
        WHERE d.developer_name IN (
            SELECT DISTINCT trim(x)
            FROM jsonb_array_elements_text(v_data->'games_to_developers'->'developers') AS t(x)
            WHERE NULLIF(trim(x), '') IS NOT NULL
        );

        DELETE FROM games_to_developers gtd
        WHERE gtd.game_id = v_game_id AND NOT gtd.developer_id = ANY(v_input_developer_ids);

        INSERT INTO games_to_developers (game_id, developer_id)
        SELECT v_game_id, developer_id
        FROM unnest(v_input_developer_ids) AS t(developer_id)
        ON CONFLICT (game_id, developer_id) DO NOTHING;
    END IF;

    IF v_data ? 'games_to_game_genres' THEN
        v_input_game_genres := ARRAY(
            SELECT DISTINCT trim(x)
            FROM jsonb_array_elements_text(
                COALESCE(
                    NULLIF(v_data->'games_to_game_genres'->'game_genres', 'null'::jsonb),
                    '[]'::jsonb
                )
            ) AS t(x)
            WHERE NULLIF(trim(x), '') IS NOT NULL
        );

        -- INSERT INTO game_genres (game_genre_name)
        -- SELECT game_genre_name
        -- FROM unnest(v_input_game_genres) AS t(game_genre_name)
        -- ON CONFLICT (game_genre_name) DO NOTHING;

        DELETE FROM games_to_game_genres gtgg
        WHERE gtgg.game_id = v_game_id
        AND NOT gtgg.game_genre_name = ANY(v_input_game_genres);

        INSERT INTO games_to_game_genres (game_id, game_genre_name)
        SELECT v_game_id, game_genre_name
        FROM unnest(v_input_game_genres) AS t(game_genre_name)
        ON CONFLICT (game_id, game_genre_name) DO NOTHING;
    END IF;

    IF v_data ? 'games_to_content_genres' THEN
        v_input_content_genres := ARRAY(
            SELECT DISTINCT trim(x)
            FROM jsonb_array_elements_text(
                COALESCE(
                    NULLIF(v_data->'games_to_content_genres'->'content_genres', 'null'::jsonb),
                    '[]'::jsonb
                )
            ) AS t(x)
            WHERE NULLIF(trim(x), '') IS NOT NULL
        );

        INSERT INTO content_genres (content_genre_name)
        SELECT content_genre_name
        FROM unnest(v_input_content_genres) AS t(content_genre_name)
        ON CONFLICT (content_genre_name) DO NOTHING;

        DELETE FROM games_to_content_genres gtcg
        WHERE gtcg.game_id = v_game_id
        AND NOT gtcg.content_genre_name = ANY(v_input_content_genres);

        INSERT INTO games_to_content_genres (game_id, content_genre_name)
        SELECT v_game_id, content_genre_name
        FROM unnest(v_input_content_genres) AS t(content_genre_name)
        ON CONFLICT (game_id, content_genre_name) DO NOTHING;
    END IF;

    RETURN v_game_id;
END;
$BODY$;

ALTER FUNCTION computer_games.set_game(integer, jsonb)
    OWNER TO postgres;
