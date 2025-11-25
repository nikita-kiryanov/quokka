import type { EnrichedGameData, GameData } from "../../types/computer-games";

/**
 * Enriches raw game data with alphabetical anchor IDs for jump-to-letter
 * navigation.
 *
 * For each unique first letter across all franchises and standalone series,
 * the first occurrence gets an `anchorId` set to that letter. Standalone
 * series (grouped under a franchise key equal to their own series name — see
 * backend/routes/computer-games.js) are checked by their own name's first
 * letter; franchised series inherit the franchise name's first letter.
 *
 * @param data - Raw game data, or `undefined` while it's still loading.
 * @returns `alphabetizedData` (the enriched data, or `undefined` if `data` was)
 * and `letters` (the sorted list of anchor letters present in it).
 */
export default function useAlphabetizedData(data: GameData | undefined) {
    function isStandaloneSeries(franchise: string, series: GameData[string]): boolean {
        const seriesNames = Object.keys(series);
        return seriesNames.length === 1 && seriesNames[0] === franchise;
    }

    function alphabetize(data: GameData): EnrichedGameData {
        if (!data) return data;

        const usedLetters = new Set<string>();
        for (const [franchise, series] of Object.entries(data)) {
            if (isStandaloneSeries(franchise, series)) {
                for (const [seriesName, _] of Object.entries(series)) {
                    const letter = seriesName[0].toUpperCase();
                    const isFirstOccurrence = !usedLetters.has(letter);
                    if (isFirstOccurrence) usedLetters.add(letter);
                }
                continue;
            }
            const letter = franchise[0].toUpperCase();
            const isFirstOccurrence = !usedLetters.has(letter);
            if (isFirstOccurrence) usedLetters.add(letter);
        }
        const enrichedData: EnrichedGameData = {};
        for (const [franchise, series] of Object.entries(data)) {
            enrichedData[franchise] = {};
            if (isStandaloneSeries(franchise, series)) {
                for (const [seriesName, games] of Object.entries(series)) {
                    const letter = seriesName[0].toUpperCase();
                    enrichedData[franchise][seriesName] = usedLetters.delete(letter)
                        ? { games, anchorId: letter }
                        : { games };
                }
                continue;
            }
            for (const [seriesName, games] of Object.entries(series)) {
                const letter = franchise[0].toUpperCase();
                enrichedData[franchise][seriesName] = usedLetters.delete(letter)
                    ? { games, anchorId: letter }
                    : { games };
            }
        }
        return enrichedData;
    };

    const alphabetizedData = data ? alphabetize(data) : undefined;
    const letters = alphabetizedData ? Object.keys(alphabetizedData).map(
        franchise => Object.keys(alphabetizedData[franchise]).map(
            series => alphabetizedData[franchise][series].anchorId
        )
    ).flat().filter(Boolean) as string[] : [];

    return { data: alphabetizedData, letters };
};