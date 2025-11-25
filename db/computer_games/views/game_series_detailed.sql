-- View: computer_games.game_series_detailed

-- DROP VIEW computer_games.game_series_detailed;

CREATE OR REPLACE VIEW computer_games.game_series_detailed AS
WITH game_genres AS (
    SELECT game_id, COALESCE(
                array_agg(game_genre_name ORDER BY game_genre_name) FILTER(WHERE game_genre_name IS NOT NULL),
                ARRAY[]::text[]
           ) AS genres
    FROM games
    LEFT JOIN games_to_game_genres USING(game_id)
    LEFT JOIN game_genres USING(game_genre_name)
    GROUP BY game_id
), content_genres AS (
    SELECT game_id, COALESCE(
                array_agg(content_genre_name ORDER BY content_genre_name) FILTER(WHERE content_genre_name IS NOT NULL),
                ARRAY[]::text[]
           ) AS content
    FROM games
    LEFT JOIN games_to_content_genres USING(game_id)
    LEFT JOIN content_genres USING(content_genre_name)
    GROUP BY game_id
), developers AS (
    SELECT game_id, COALESCE(
                array_agg(developer_name ORDER BY developer_name) FILTER(WHERE developer_name IS NOT NULL),
                ARRAY[]::text[]
           ) AS developer_name
    FROM games
    LEFT JOIN games_to_developers USING(game_id)
    LEFT JOIN developers USING(developer_id)
    GROUP BY game_id
), games_with_joins AS (
    SELECT game_id, game_name, dlc_for, series_id, initial_release_date, played, comments, hidden,
           remake_for, chronology_date, franchise_id, franchise_name AS franchise,
           COALESCE(series_name, 'Not A Series'::text) AS series, developer_name AS developers,
           genres, content, spinoff_for IS NULL AS main_series
    FROM games
    LEFT JOIN franchise USING(franchise_id)
    LEFT JOIN series USING(series_id)
    LEFT JOIN developers USING(game_id)
    LEFT JOIN game_genres USING(game_id)
    LEFT JOIN content_genres USING(game_id)
)
SELECT a.game_id, a.dlc_for, COALESCE(franchise, '') AS franchise,
       series, a.game_name AS game, genres AS game_genres, content, a.initial_release_date,
       developers, a.played, a.comments, is_dlc, a.remake_for, a.chronology_date
FROM (
    SELECT game_id, NULL AS dlc_for, franchise, series, game_name, genres, content,
           initial_release_date, developers, played, comments, false AS is_dlc,
           initial_release_date || game_name AS bundle_name, true AS is_prime, chronology_date,
           main_series, remake_for
    FROM games_with_joins
    WHERE dlc_for IS NULL AND NOT hidden
    UNION
    SELECT dlc.game_id, dlc.dlc_for, dlc.franchise, dlc.series, dlc.game_name,
           dlc.genres, dlc.content, dlc.initial_release_date, dlc.developers, dlc.played, dlc.comments,
           true AS is_dlc, prime.initial_release_date || prime.game_name AS bundle_name, false AS is_prime,
           prime.chronology_date, dlc.main_series, dlc.remake_for
    FROM games prime
    JOIN games_with_joins dlc ON dlc.dlc_for = prime.game_id
    LEFT JOIN games_to_game_genres ON games_to_game_genres.game_id = dlc.game_id
    LEFT JOIN game_genres ON game_genres.game_id = dlc.game_id
    WHERE NOT dlc.hidden
) a
LEFT JOIN games remake ON remake.remake_for = a.game_id
WHERE NOT (a.played = false AND COALESCE(remake.played, false) = true)
ORDER BY COALESCE(franchise, series), main_series DESC, COALESCE(series, a.game_name),
         a.chronology_date, bundle_name, is_prime DESC, initial_release_date;

ALTER TABLE computer_games.game_series_detailed
    OWNER TO postgres;

