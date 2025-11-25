import type { EnrichedMovieData, MovieData } from "../../types/movies";

/**
 * Enriches raw movie data with alphabetical anchor IDs for jump-to-letter
 * navigation.
 *
 * For each unique first letter across all series, the first occurrence (in
 * key order) gets an `anchorId` set to that letter.
 *
 * @param data - Raw movie data, or `undefined` while it's still loading.
 * @returns `data` (the enriched data, or `undefined` if the input was) and
 * `letters` (the sorted list of anchor letters present in it).
 */
export default function useAlphabetizedData(data: MovieData | undefined) {
    function alphabetize(data: MovieData): EnrichedMovieData {
        if (!data) return data;

        const usedLetters = new Set<string>();
        for (const series of Object.keys(data)) {
            const letter = series[0].toUpperCase();
            const isFirstOccurrence = !usedLetters.has(letter);
            if (isFirstOccurrence) usedLetters.add(letter);
        }
        const enrichedData: EnrichedMovieData = {};
        for (const [series, movies] of Object.entries(data)) {
            const letter = series[0].toUpperCase();
            enrichedData[series] = usedLetters.delete(letter)
                ? { movies, anchorId: letter }
                : { movies };
        }
        return enrichedData;
    };

    const alphabetizedData = data ? alphabetize(data) : undefined;
    const letters = alphabetizedData ? Object.keys(alphabetizedData).map(
        series => alphabetizedData[series].anchorId
    ).flat().filter(Boolean) as string[] : [];

    return { data: alphabetizedData, letters };
};