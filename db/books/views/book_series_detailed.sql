-- View: books.book_series_detailed

-- DROP VIEW books.book_series_detailed;

CREATE OR REPLACE VIEW books.book_series_detailed AS
WITH genres AS (
    SELECT book_id, COALESCE(
        array_agg(book_genre_name ORDER BY book_genre_name) FILTER(WHERE book_genre_name IS NOT NULL),
        ARRAY[]::text[]
    ) AS genres
    FROM books
    LEFT JOIN books_to_book_genres USING(book_id)
    LEFT JOIN book_genres USING(book_genre_name)
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
)
SELECT book_id, book_name AS book, COALESCE(series_name, 'Not A Series'::text) AS series,
       release_date, read, comments, author_name AS authors, genres
FROM books
LEFT JOIN series USING(series_id)
LEFT JOIN authors USING(book_id)
LEFT JOIN genres USING(book_id)
WHERE NOT hidden
ORDER BY series_name, release_date;

ALTER TABLE books.book_series_detailed
    OWNER TO postgres;
