-- View: tv.show_series_detailed

-- DROP VIEW tv.show_series_detailed;

CREATE OR REPLACE VIEW tv.show_series_detailed AS
WITH last_unwatched AS (
    SELECT DISTINCT ON (show_id) show_id, season, episode
    FROM episodes
    WHERE NOT watched
    ORDER BY show_id, season, episode
), episode_count AS (
    SELECT show_id, count(DISTINCT season) AS seasons, count(*) AS episodes
    FROM episodes
    GROUP BY show_id
)
SELECT show_id, series_name, show_name AS show, seasons, episodes, ended,
       CASE WHEN episodes IS NULL THEN ''
            WHEN lw.show_id IS NULL THEN 'Finished'
            ELSE 'S' || lw.season || 'E' || lw.episode
       END AS bookmark
FROM shows
LEFT JOIN last_unwatched lw USING (show_id)
LEFT JOIN episode_count USING (show_id)
LEFT JOIN series USING(series_id)
ORDER BY COALESCE(series_name, show_name), show_name;

ALTER TABLE tv.show_series_detailed
    OWNER TO postgres;