-- FUNCTION: movies.set_movie(integer, jsonb)

-- DROP FUNCTION IF EXISTS movies.set_movie(integer, jsonb);

CREATE OR REPLACE FUNCTION movies.set_movie(
    v_movie_id integer,
    v_data jsonb)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_series_name text;
    v_series_id integer;
    v_movie_name text;
    v_input_directors text[];
    v_input_genres text[];
BEGIN
    IF v_data ? 'movies' THEN
        v_series_name := NULLIF(trim(v_data->'movies'->>'series_name'), '');

        IF v_series_name IS NOT NULL THEN
            INSERT INTO series (series_name, movies)
            VALUES (v_series_name, true)
            ON CONFLICT (series_name)
            DO UPDATE
            SET movies = true
            RETURNING series_id
            INTO v_series_id;
        ELSE
            v_series_id := NULL;
        END IF;

        v_movie_name := NULLIF(trim(v_data->'movies'->>'movie_name'), '');

        IF v_movie_id IS NULL THEN
            INSERT INTO movies (series_id, movie_name, release_date, watched, comments)
            VALUES (
                v_series_id, v_movie_name, (v_data->'movies'->>'release_date')::date,
                (v_data->'movies'->>'watched')::boolean, v_data->'movies'->>'comments'
            )
            RETURNING movie_id
            INTO v_movie_id;
        ELSE
            UPDATE movies
            SET series_id = v_series_id,
                movie_name = v_movie_name,
                release_date = (v_data->'movies'->>'release_date')::date,
                watched = (v_data->'movies'->>'watched')::boolean,
                comments = v_data->'movies'->>'comments'
            WHERE movie_id = v_movie_id;
        END IF;
    END IF;

    IF v_data ? 'movies_to_directors' THEN
        INSERT INTO directors (director_name)
        SELECT DISTINCT trim(x)
        FROM jsonb_array_elements_text(v_data->'movies_to_directors'->'directors') AS t(x)
        WHERE NULLIF(trim(x), '') IS NOT NULL
        ON CONFLICT (director_name) DO NOTHING;

        v_input_directors := ARRAY(
            SELECT DISTINCT trim(x)
            FROM jsonb_array_elements_text(
                COALESCE(
                    NULLIF(v_data->'movies_to_directors'->'directors', 'null'::jsonb),
                    '[]'::jsonb
                )
            ) AS t(x)
            WHERE NULLIF(trim(x), '') IS NOT NULL
        );

        DELETE FROM movies_to_directors mtd
        WHERE mtd.movie_id = v_movie_id AND NOT mtd.director_name = ANY(v_input_directors);

        INSERT INTO movies_to_directors (movie_id, director_name)
        SELECT v_movie_id, director_name
        FROM unnest(v_input_directors) AS t(director_name)
        ON CONFLICT (movie_id, director_name) DO NOTHING;
    END IF;

    IF v_data ? 'movies_to_genres' THEN
        v_input_genres := ARRAY(
            SELECT DISTINCT trim(x)
            FROM jsonb_array_elements_text(
                COALESCE(
                    NULLIF(v_data->'movies_to_genres'->'genres', 'null'::jsonb),
                    '[]'::jsonb
                )
            ) AS t(x)
            WHERE NULLIF(trim(x), '') IS NOT NULL
        );

        DELETE FROM movies_to_genres mtg
        WHERE mtg.movie_id = v_movie_id
        AND NOT mtg.genre_name = ANY(v_input_genres);

        INSERT INTO movies_to_genres (movie_id, genre_name)
        SELECT v_movie_id, genre_name
        FROM unnest(v_input_genres) AS t(genre_name)
        ON CONFLICT (movie_id, genre_name) DO NOTHING;
    END IF;

    RETURN v_movie_id;
END;
$BODY$;

ALTER FUNCTION movies.set_movie(integer, jsonb)
    OWNER TO postgres;
