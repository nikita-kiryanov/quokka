-- FUNCTION: computer_games.get_game(integer)

-- DROP FUNCTION IF EXISTS computer_games.get_game(integer);

CREATE OR REPLACE FUNCTION computer_games.get_game(
    v_game_id integer)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_retval jsonb;
BEGIN
    SELECT jsonb_build_object(
        'games', jsonb_build_object(
            'game_name', games.game_name,
            'dlc_for', dlc.game_name,
            'series_name', series_name,
            'initial_release_date', games.initial_release_date,
            'played', games.played,
            'comments', games.comments,
            'remake_for', remake.game_name,
            'chronology_date', games.chronology_date,
            'franchise_name', franchise_name
        ),
        'games_to_developers', jsonb_build_object(
            'developers', array_agg(DISTINCT developer_name) FILTER (WHERE developer_name IS NOT NULL)
        ),
        'games_to_game_genres', jsonb_build_object(
            'game_genres', array_agg(DISTINCT game_genre_name) FILTER (WHERE game_genre_name IS NOT NULL)
        ),
        'games_to_content_genres', jsonb_build_object(
            'content_genres', array_agg(DISTINCT content_genre_name) FILTER (WHERE content_genre_name IS NOT NULL)
        )
    ) AS json
    INTO v_retval
    FROM games
    LEFT JOIN series USING(series_id)
    LEFT JOIN franchise USING(franchise_id)
    LEFT JOIN games_to_developers USING(game_id)
    LEFT JOIN games_to_game_genres USING(game_id)
    LEFT JOIN games_to_content_genres USING(game_id)
    LEFT JOIN developers USING(developer_id)
    LEFT JOIN games dlc ON games.dlc_for = dlc.game_id
    LEFT JOIN games remake ON games.remake_for = remake.game_id
    WHERE games.game_id = v_game_id
    GROUP BY games.game_name, dlc.game_name, series_name, games.initial_release_date, games.played,
             games.comments, remake.game_name, games.chronology_date, franchise_name;

    RETURN v_retval;
END;
$BODY$;

ALTER FUNCTION computer_games.get_game(integer)
    OWNER TO postgres;
