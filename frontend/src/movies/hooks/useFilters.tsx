import { useReducer, useState } from "react";
import type { MovieData } from "../../types/movies";

type MovieFilterState = {
    genre: string;
    director: string;
    year: string;
    organization: string;
}

export type MovieFilterAction =
    | { type: 'SET_GENRE'; value: string }
    | { type: 'SET_DIRECTOR'; value: string }
    | { type: 'SET_YEAR'; value: string }
    | { type: 'SET_ORGANIZATION'; value: string }
    | { type: 'RESET_FILTERS' };

const empty = { genre: '', director: '', year: '', organization: '' };

const reducer = (state: MovieFilterState, action: MovieFilterAction): MovieFilterState => {
    switch (action.type) {
        case 'SET_GENRE':
            return { ...empty, genre: action.value };
        case 'SET_ORGANIZATION':
            return { ...empty, organization: action.value };
        case 'SET_DIRECTOR':
            return { ...empty, director: action.value };
        case 'SET_YEAR':
            return { ...empty, year: action.value };
        case 'RESET_FILTERS':
            return empty;
        default:
            return state;
    }
}

/**
 * Manages the genre/organization/director/year filters and the "hide completed" toggle
 * for the movie list, and applies them to the given data.
 *
 * Only one of genre, director, or year is active at a time — setting one
 * resets the others. The "hide completed" toggle is independent and stacks
 * with whichever of those is active.
 *
 * @param data - Raw movie data keyed by series, or `undefined` while it's
 * still loading.
 * @returns the active `genre`/`director`/`year` filter values, `filter`
 * (dispatch for filter actions), `filterTitle`/`filterText` (for the
 * active-filter banner), `filteredData` (`data` with all active filters
 * applied), `completed`/`handleHideCompleted` (the "hide completed"
 * toggle), and `toggleGenre` (sets the genre filter, or clears it if
 * already active).
 */
export default function useFilters(data: MovieData | undefined) {
    const [state, dispatch] = useReducer(reducer, empty);
    const [completed, setCompleted] = useState<boolean>(false);

    const toggleGenre = (newGenre: string) => {
        if (state.genre === newGenre) {
            dispatch({ type: 'RESET_FILTERS' });
            return;
        }
        dispatch({ type: 'SET_GENRE', value: newGenre });
    }

    const toggleOrganization = (newOrganization: string) => {
        if (state.organization === newOrganization) {
            dispatch({ type: 'RESET_FILTERS' });
            return;
        }
        dispatch({ type: 'SET_ORGANIZATION', value: newOrganization });
    }

    const handleHideCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompleted(e.target.checked);
    }

    const filterText = state.director ? state.director :
                       state.genre ? state.genre :
                       state.organization ? state.organization :
                       state.year ? state.year :
                       '';
    const filterTitle = state.director ? 'Director' :
                        state.genre ? 'Genre' :
                        state.organization ? 'Organisation' :
                        state.year ? 'Year' :
                        '';

    const filterMovieData = (data: MovieData | undefined) => {
        if (!data)
            return data;

        const filterMovies = (predicate: (movie: MovieData[string][number]) => boolean) => {
            const result: MovieData = {};
            for (const [series, movies] of Object.entries(data!)) {
                const filtered = movies.filter(predicate);
                if (filtered.length > 0) {
                    result[series] = filtered;
                }
            }
            return result;
        };

        if (state.director)
            data = filterMovies(movie => movie.directors?.includes(state.director));
        if (state.year)
            data = filterMovies(movie => movie.release_date.startsWith(state.year));
        if (state.genre)
            data = filterMovies(movie => movie.genres?.includes(state.genre));
        if (state.organization)
            data = filterMovies(movie => movie.organization?.includes(state.organization));
        if (completed)
            data = filterMovies(movie => !movie.watched);

        return data;
    }

    const filteredData = filterMovieData(data);

    return {
        genre: state.genre, director: state.director, year: state.year, organization: state.organization,
        filter: dispatch, filterTitle, filterText, filteredData, handleHideCompleted, completed,
        toggleGenre, toggleOrganization
    };
}
