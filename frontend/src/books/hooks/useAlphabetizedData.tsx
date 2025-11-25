import type { EnrichedBookData, BooksData } from "../../types/books";

/**
 * Enriches raw book data with alphabetical anchor IDs for jump-to-letter
 * navigation.
 *
 * For each unique first letter across all series, the first occurrence (in
 * key order) gets an `anchorId` set to that letter.
 *
 * @param data - Raw book data, or `undefined` while it's still loading.
 * @returns `data` (the enriched data, or `undefined` if the input was) and
 * `letters` (the sorted list of anchor letters present in it).
 */
export default function useAlphabetizedData(data: BooksData | undefined) {
    function alphabetize(data: BooksData): EnrichedBookData {
        if (!data) return data;

        const usedLetters = new Set<string>();
        for (const series of Object.keys(data)) {
            const letter = series[0].toUpperCase();
            const isFirstOccurrence = !usedLetters.has(letter);
            if (isFirstOccurrence) usedLetters.add(letter);
        }
        const enrichedData: EnrichedBookData = {};
        for (const [series, books] of Object.entries(data)) {
            const letter = series[0].toUpperCase();
            enrichedData[series] = usedLetters.delete(letter)
                ? { books, anchorId: letter }
                : { books };
        }
        return enrichedData;
    };

    const alphabetizedData = data ? alphabetize(data) : undefined;
    const letters = alphabetizedData ? Object.keys(alphabetizedData).map(
        series => alphabetizedData[series].anchorId
    ).flat().filter(Boolean) as string[] : [];

    return { data: alphabetizedData, letters };
};