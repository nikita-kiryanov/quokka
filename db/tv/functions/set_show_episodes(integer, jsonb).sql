-- FUNCTION: tv.set_show_episodes(integer, jsonb)

-- DROP FUNCTION IF EXISTS tv.set_show_episodes(integer, jsonb);

CREATE OR REPLACE FUNCTION tv.set_show_episodes(
    v_show_id integer,
    v_data jsonb)
    RETURNS void
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
INSERT INTO episodes(show_id, season, episode, watched)
SELECT v_show_id, (season_elem->>'season')::int, (episode_elem->>'episode')::int,
        (episode_elem->>'watched')::boolean
FROM jsonb_array_elements(v_data) AS season_elem
CROSS JOIN LATERAL jsonb_array_elements(season_elem->'episodes') AS episode_elem
ON CONFLICT (show_id, season, episode)
DO UPDATE SET watched = EXCLUDED.watched;
$BODY$;

ALTER FUNCTION tv.set_show_episodes(integer, jsonb)
    OWNER TO postgres;
