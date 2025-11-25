-- View: hot_sauces.sauce_brands_detailed

-- DROP VIEW hot_sauces.sauce_brands_detailed;

CREATE OR REPLACE VIEW hot_sauces.sauce_brands_detailed AS
WITH peppers AS (
    SELECT sauce_id, COALESCE(array_agg(pepper_name ORDER BY pepper_name)
                              FILTER(WHERE pepper_name IS NOT NULL), ARRAY[]::text[]) AS peppers
    FROM sauces_to_peppers
    GROUP BY sauce_id
)
SELECT sauce_id, sauce_name AS sauce, brand_name AS brand, comments, rating, peppers
FROM sauces
LEFT JOIN peppers USING (sauce_id)
ORDER BY brand_name, sauce_name;

ALTER TABLE hot_sauces.sauce_brands_detailed
    OWNER TO postgres;

