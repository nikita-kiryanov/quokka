-- View: books.book_series_detailed

-- DROP VIEW books.book_series_detailed;

CREATE OR REPLACE VIEW books.book_series_detailed AS
WITH content_genres AS (
    SELECT book_id, COALESCE(
        array_agg(content_genre_name ORDER BY content_genre_name) FILTER(WHERE content_genre_name IS NOT NULL),
        ARRAY[]::text[]
    ) AS content
    FROM books
    LEFT JOIN books_to_content_genres USING(book_id)
    LEFT JOIN content_genres USING(content_genre_name)
    GROUP BY book_id
), authors AS (
    SELECT book_id, COALESCE(
        array_agg(author_name ORDER BY author_name) FILTER(WHERE author_name IS NOT NULL),
        ARRAY[]::text[]
    ) AS author_name
    FROM books
    LEFT JOIN books_to_authors USING(book_id)
    LEFT JOIN authors USING(author_id)
    GROUP BY book_id
), genres AS (
    SELECT book_id, '' AS genre
    FROM books
)
SELECT book_id, COALESCE(series_name, 'Not A Series'::text) AS series, book_name,
       initial_release_date, read, comments, author_name AS authors, genre, content
FROM books
LEFT JOIN series USING(series_id)
LEFT JOIN authors USING(book_id)
LEFT JOIN genres USING(book_id)
LEFT JOIN content_genres USING(book_id)
WHERE NOT hidden
ORDER BY series_name, initial_release_date;

ALTER TABLE books.book_series_detailed
    OWNER TO postgres;
