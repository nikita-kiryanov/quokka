import type { EnrichedGameData, GameData, SeriesEntry } from "../../types/computer-games";

/**
 * Enriches raw game data with alphabetical anchor IDs for jump-to-letter
 * navigation.
 *
 * Every series is grouped under a franchise (standalone series use a
 * franchise key equal to their own series name — see
 * backend/routes/computer-games.js), so the franchise name's first letter is
 * the only letter that matters here: for each unique first letter, the first
 * franchise entry with that letter gets tagged with an `anchorId`, which its
 * header renders as the jump target.
 *
 * @param data - Raw game data, or `undefined` while it's still loading.
 * @returns `alphabetizedData` (the enriched data, or `undefined` if `data` was)
 * and `letters` (the sorted list of anchor letters present in it).
 */
export default function useAlphabetizedData(data: GameData | undefined) {
    function alphabetize(data: GameData): EnrichedGameData {
        if (!data)
            return data;

        const usedLetters = new Set<string>();
        for (const franchise of Object.keys(data)) {
            const letter = franchise[0].toUpperCase();
            usedLetters.add(letter);
        }

        const enrichedData: EnrichedGameData = {};
        for (const [franchise, series] of Object.entries(data)) {
            const letter = franchise[0].toUpperCase();
            const seriesEntries: Record<string, SeriesEntry> = {};
            for (const [seriesName, games] of Object.entries(series)) {
                seriesEntries[seriesName] = { games };
            }
            enrichedData[franchise] = usedLetters.delete(letter)
                ? { series: seriesEntries, anchorId: letter }
                : { series: seriesEntries };
        }
        return enrichedData;
    };

    const alphabetizedData = data ? alphabetize(data) : undefined;
    const letters = alphabetizedData
        ? Object.values(alphabetizedData).map(entry => entry.anchorId).filter(Boolean) as string[]
        : [];

    return { data: alphabetizedData, letters };
};