-- View: movies.movie_series_detailed

-- DROP VIEW movies.movie_series_detailed;

CREATE OR REPLACE VIEW movies.movie_series_detailed AS
WITH directors AS (
    SELECT movie_id, COALESCE(
        array_agg(director_name ORDER BY director_name) FILTER (WHERE director_name IS NOT NULL),
        ARRAY[]::text[]
    ) AS directors
    FROM movies_to_directors
    GROUP BY movie_id
), genres AS (
    SELECT movie_id, COALESCE(
        array_agg(genre_name ORDER BY genre_name) FILTER (WHERE genre_name IS NOT NULL),
        ARRAY[]::text[]
    ) AS genres
    FROM movies
    LEFT JOIN movies_to_genres USING(movie_id)
    GROUP BY movie_id
), organizations AS (
    SELECT movie_id, COALESCE(
        array_agg(organization ORDER BY organization) FILTER (WHERE organization IS NOT NULL),
        ARRAY[]::text[]
    ) AS organization
    FROM movies
    LEFT JOIN organizational_units USING(movie_id)
    GROUP BY movie_id
)
SELECT movie_id, movie_name AS movie, release_date, watched, comments, series_name, directors,
       genres, organization
FROM movies
LEFT JOIN series USING(series_id)
LEFT JOIN directors USING(movie_id)
LEFT JOIN genres USING(movie_id)
LEFT JOIN organizations USING(movie_id)
WHERE NOT hidden
ORDER BY series_name, release_date;

ALTER TABLE movies.movie_series_detailed
    OWNER TO postgres;

