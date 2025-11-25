-- FUNCTION: books.set_book(integer, jsonb)

-- DROP FUNCTION IF EXISTS books.set_book(integer, jsonb);

CREATE OR REPLACE FUNCTION books.set_book(
    v_book_id integer,
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
    v_book_name text;
    v_input_author_ids integer[];
    v_input_content_genres text[];
BEGIN
    IF v_data ? 'books' THEN
        v_series_name := NULLIF(trim(v_data->'books'->>'series_name'), '');

        IF v_series_name IS NOT NULL THEN
            INSERT INTO series (series_name, books)
            VALUES (v_series_name, true)
            ON CONFLICT (series_name)
            DO UPDATE
            SET books = true
            RETURNING series_id
            INTO v_series_id;
        ELSE
            v_series_id := NULL;
        END IF;

        v_franchise_name := NULLIF(trim(v_data->'books'->>'franchise_name'), '');

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

        v_book_name := NULLIF(trim(v_data->'books'->>'book_name'), '');

        IF v_book_id IS NULL THEN
            INSERT INTO books (franchise_id, series_id, book_name, release_date, read, comments)
            VALUES (
                v_franchise_id, v_series_id, v_book_name, (v_data->'books'->>'release_date')::date,
                (v_data->'books'->>'read')::boolean, v_data->'books'->>'comments'
            )
            RETURNING book_id
            INTO v_book_id;
        ELSE
            UPDATE books
            SET franchise_id = v_franchise_id,
                series_id = v_series_id,
                book_name = v_book_name,
                release_date = (v_data->'books'->>'release_date')::date,
                read = (v_data->'books'->>'read')::boolean,
                comments = v_data->'books'->>'comments'
            WHERE book_id = v_book_id;
        END IF;
    END IF;

    IF v_data ? 'books_to_authors' THEN
        INSERT INTO authors (author_name)
        SELECT DISTINCT trim(x)
        FROM jsonb_array_elements_text(v_data->'books_to_authors'->'authors') AS t(x)
        WHERE NULLIF(trim(x), '') IS NOT NULL
        ON CONFLICT (author_name) DO NOTHING;

        SELECT COALESCE(array_agg(a.author_id), ARRAY[]::integer[])
        INTO v_input_author_ids
        FROM authors a
        WHERE a.author_name IN (
            SELECT DISTINCT trim(x)
            FROM jsonb_array_elements_text(v_data->'books_to_authors'->'authors') AS t(x)
            WHERE NULLIF(trim(x), '') IS NOT NULL
        );

        DELETE FROM books_to_authors bta
        WHERE bta.book_id = v_book_id AND NOT bta.author_id = ANY(v_input_author_ids);

        INSERT INTO books_to_authors (book_id, author_id)
        SELECT v_book_id, author_id
        FROM unnest(v_input_author_ids) AS t(author_id)
        ON CONFLICT (book_id, author_id) DO NOTHING;
    END IF;

    IF v_data ? 'books_to_content_genres' THEN
        v_input_content_genres := ARRAY(
            SELECT DISTINCT trim(x)
            FROM jsonb_array_elements_text(
                COALESCE(
                    NULLIF(v_data->'books_to_content_genres'->'content_genres', 'null'::jsonb),
                    '[]'::jsonb
                )
            ) AS t(x)
            WHERE NULLIF(trim(x), '') IS NOT NULL
        );

        INSERT INTO content_genres (content_genre_name)
        SELECT content_genre_name
        FROM unnest(v_input_content_genres) AS t(content_genre_name)
        ON CONFLICT (content_genre_name) DO NOTHING;

        DELETE FROM books_to_content_genres btcg
        WHERE btcg.book_id = v_book_id
        AND NOT btcg.content_genre_name = ANY(v_input_content_genres);

        INSERT INTO books_to_content_genres (book_id, content_genre_name)
        SELECT v_book_id, content_genre_name
        FROM unnest(v_input_content_genres) AS t(content_genre_name)
        ON CONFLICT (book_id, content_genre_name) DO NOTHING;
    END IF;

    RETURN v_book_id;
END;
$BODY$;

ALTER FUNCTION books.set_book(integer, jsonb)
    OWNER TO postgres;
