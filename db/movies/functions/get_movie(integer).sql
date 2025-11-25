-- FUNCTION: movies.get_movie(integer)

-- DROP FUNCTION IF EXISTS movies.get_movie(integer);

CREATE OR REPLACE FUNCTION movies.get_movie(
    v_movie_id integer)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_retval jsonb;
BEGIN
    SELECT jsonb_build_object(
        'movies', jsonb_build_object(
            'movie_name', movies.movie_name,
            'series_name', series_name,
            'release_date', movies.release_date,
            'watched', movies.watched,
            'comments', movies.comments
        ),
        'movies_to_directors', jsonb_build_object(
            'directors', array_agg(DISTINCT director_name) FILTER (WHERE director_name IS NOT NULL)
        ),
        'movie_to_genres', jsonb_build_object(
            'genres', array_agg(DISTINCT genre_name) FILTER (WHERE genre_name IS NOT NULL)
        )
    ) AS json
    INTO v_retval
    FROM movies
    LEFT JOIN series USING(series_id)
    LEFT JOIN movies_to_directors USING(movie_id)
    LEFT JOIN movies_to_genres USING(movie_id)
    LEFT JOIN directors USING(director_name)
    WHERE movies.movie_id = v_movie_id
    GROUP BY movies.movie_name, series_name, movies.release_date, movies.watched,
             movies.comments;

    RETURN v_retval;
END;
$BODY$;

ALTER FUNCTION movies.get_movie(integer)
    OWNER TO postgres;
