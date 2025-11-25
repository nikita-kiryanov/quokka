import type { AlphabetizedTV, Show } from "../../types/tv";

/**
 * Sorts a flat list of shows by title and tags the first show of each
 * letter with an `anchorId`, for jump-to-letter navigation.
 *
 * @param data - Raw show list, or `undefined` while it's still loading.
 * @returns `data` (the sorted, tagged list, or `undefined` if the input was)
 * and `letters` (the sorted list of anchor letters present in it).
 */
export default function useAlphabetizedData(data: Show[] | undefined) {
    function alphabetize(data: Show[]): AlphabetizedTV[] {
        const sorted = [...data].sort((a, b) => a.show.localeCompare(b.show));

        const usedLetters = new Set<string>();
        return sorted.map(show => {
            const letter = show.show[0].toUpperCase();
            if (usedLetters.has(letter)) return { show };

            usedLetters.add(letter);
            return { show, anchorId: letter };
        });
    };

    const alphabetizedData = data ? alphabetize(data) : undefined;
    const letters = alphabetizedData
        ? alphabetizedData.map(entry => entry.anchorId).filter(Boolean) as string[]
        : [];

    return { data: alphabetizedData, letters };
};
