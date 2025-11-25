import { useReducer, useState, type ChangeEvent } from "react";
import type { GameData } from "../../types/computer-games";

type GameFilterState = {
    genre: string;
    content: string;
    developer: string;
    year: string;
}

export type GameFilterAction =
    | { type: 'SET_GENRE'; value: string }
    | { type: 'SET_CONTENT'; value: string }
    | { type: 'SET_DEVELOPER'; value: string }
    | { type: 'SET_YEAR'; value: string }
    | { type: 'RESET_FILTERS' };

const empty = { genre: '', content: '', developer: '', year: '' };

const reducer = (state: GameFilterState, action: GameFilterAction): GameFilterState => {
    switch (action.type) {
        case 'SET_GENRE':
            return { ...empty, genre: action.value };
        case 'SET_CONTENT':
            return { ...empty, content: action.value };
        case 'SET_DEVELOPER':
            return { ...empty, developer: action.value };
        case 'SET_YEAR':
            return { ...empty, year: action.value };
        case 'RESET_FILTERS':
            return empty;
        default:
            return state;
    }
}

/**
 * Manages the genre/content/developer/year filters and the "hide completed"
 * toggle for the game list, and applies them to the given data.
 *
 * Only one of genre, content, developer, or year is active at a time —
 * setting one resets the others. The "hide completed" toggle is independent
 * and stacks with whichever of those is active.
 *
 * @param data - Raw game data (franchise -> series -> games), or `undefined`
 * while it's still loading.
 * @returns the active `genre`/`contnet`/`developer`/`year` filter values,
 * `filter` (dispatch for filter actions), `filterTitle`/`filterText` (for
 * the active-filter banner), `filteredData` (`data` with all active filters
 * applied), `completed`/`toggleCompleted` (the "hide completed" toggle), and
 * `toggleGenre` (sets the genre filter, or clears it if already active).
 */
export default function useFilters(data: GameData | undefined) {
    const [state, dispatch] = useReducer(reducer, empty);
    const [completed, setCompleted] = useState<boolean>(false);

    const toggleCompleted = (e: ChangeEvent<HTMLInputElement>) => setCompleted(e.target.checked);
    const toggleGenre = (newGenre: string) => dispatch({
        type: 'SET_GENRE', value: state.genre === newGenre ? '' : newGenre
    });

    const filterText = state.developer ? state.developer :
                       state.content ? state.content :
                       state.year ? state.year :
                       state.genre ? state.genre :
                       '';
    const filterTitle = state.developer ? 'Developer' :
                        state.content ? 'Content' :
                        state.year ? 'Year' :
                        state.genre ? 'Genre' :
                        '';

    const filterGameData = (data: GameData | undefined) => {
        if (!data)
            return data;

        const filterGames = (predicate: (game: GameData[string][string][number]) => boolean) => {
            const result: GameData = {};
            for (const [franchise, series] of Object.entries(data!)) {
                const filteredSeries: GameData[string] = {};
                for (const [seriesName, games] of Object.entries(series)) {
                    const filtered = games.filter(predicate);
                    if (filtered.length > 0) {
                        filteredSeries[seriesName] = filtered;
                    }
                }
                if (Object.keys(filteredSeries).length > 0) {
                    result[franchise] = filteredSeries;
                }
            }
            return result;
        };

        if (state.developer)
            data = filterGames(game => game.developers?.includes(state.developer));
        if (state.content)
            data = filterGames(game => game.content?.includes(state.content));
        if (state.year)
            data = filterGames(game => game.initial_release_date.startsWith(state.year));
        if (state.genre)
            data = filterGames(game => game.game_genres?.includes(state.genre));
        if (completed)
            data = filterGames(game => !game.played || !game.dlcs_played);

        return data;
    }

    const filteredData = filterGameData(data);

    return {
        genre: state.genre, contnet: state.content, developer: state.developer, year: state.year,
        filter: dispatch, filterTitle, filterText, filteredData, toggleCompleted, completed,
        toggleGenre
    };
}
