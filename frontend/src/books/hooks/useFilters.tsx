import { useReducer, useState } from "react";
import type { BooksData } from "../../types/books";

type BookFilterState = {
    genre: string;
    author: string;
    year: string;
}

export type BookFilterAction =
    | { type: 'SET_GENRE'; value: string }
    | { type: 'SET_AUTHOR'; value: string }
    | { type: 'SET_YEAR'; value: string }
    | { type: 'RESET_FILTERS' };

const empty = { genre: '', author: '', year: '' };

const reducer = (state: BookFilterState, action: BookFilterAction): BookFilterState => {
    switch (action.type) {
        case 'SET_GENRE':
            return { ...empty, genre: action.value };
        case 'SET_AUTHOR':
            return { ...empty, author: action.value };
        case 'SET_YEAR':
            return { ...empty, year: action.value };
        case 'RESET_FILTERS':
            return empty;
        default:
            return state;
    }
}

/**
 * Manages the genre/author/year filters and the "hide completed" toggle
 * for the book list, and applies them to the given data.
 *
 * Only one of genre, author, or year is active at a time — setting one
 * resets the others. The "hide completed" toggle is independent and stacks
 * with whichever of those is active.
 *
 * @param data - Raw book data keyed by series, or `undefined` while it's
 * still loading.
 * @returns the active `genre`/`author`/`year` filter values, `filter`
 * (dispatch for filter actions), `filterTitle`/`filterText` (for the
 * active-filter banner), `filteredData` (`data` with all active filters
 * applied), `completed`/`handleHideCompleted` (the "hide completed"
 * toggle), and `toggleGenre` (sets the genre filter, or clears it if
 * already active).
 */
export default function useFilters(data: BooksData | undefined) {
    const [state, dispatch] = useReducer(reducer, empty);
    const [completed, setCompleted] = useState<boolean>(false);

    const toggleGenre = (newGenre: string) => {
        if (state.genre === newGenre) {
            dispatch({ type: 'RESET_FILTERS' });
            return;
        }
        dispatch({ type: 'SET_GENRE', value: newGenre });
    }

    const handleHideCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompleted(e.target.checked);
    }

    const filterText = state.author ? state.author :
                       state.genre ? state.genre :
                       state.year ? state.year :
                       '';
    const filterTitle = state.author ? 'Author' :
                        state.genre ? 'Genre' :
                        state.year ? 'Year' :
                        '';

    const filterBookData = (data: BooksData | undefined) => {
        if (!data) return data;

        const filterBooks = (predicate: (book: BooksData[string][number]) => boolean) => {
            const result: BooksData = {};
            for (const [series, books] of Object.entries(data!)) {
                const filtered = books.filter(predicate);
                if (filtered.length > 0) {
                    result[series] = filtered;
                }
            }
            return result;
        };

        if (state.author) data = filterBooks(book => book.authors?.includes(state.author));
        if (state.year) data = filterBooks(book => book.release_date.startsWith(state.year));
        if (state.genre) data = filterBooks(book => book.genres?.includes(state.genre));
        if (completed) data = filterBooks(book => !book.read);

        return data;
    }

    const filteredData = filterBookData(data);

    return {
        genre: state.genre, author: state.author, year: state.year, filter: dispatch, filterTitle,
        filterText, filteredData, handleHideCompleted, completed, toggleGenre
    };
}
