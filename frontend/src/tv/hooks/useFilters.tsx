import { useReducer, useState } from "react";
import type { Show } from "../../types/tv";

type TVFilterState = {
    series: string;
    genre: string;
}

export type TVFilterAction =
    | { type: 'SET_SERIES'; value: string }
    | { type: 'SET_GENRE'; value: string }
    | { type: 'RESET_FILTERS' };

const empty = { series: '', genre: '' };

const reducer = (state: TVFilterState, action: TVFilterAction): TVFilterState => {
    switch (action.type) {
        case 'SET_SERIES':
            return { ...empty, series: action.value };
        case 'SET_GENRE':
            return { ...empty, genre: action.value };
        case 'RESET_FILTERS':
            return empty;
        default:
            return state;
    }
}

export default function useFilters(data: Show[] | undefined) {
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

    const filterText = state.series ? state.series : state.genre;
    const filterTitle = state.series ? 'Series' : state.genre ? 'Genre' : '';

    const filterTVData = (data: Show[] | undefined) => {
        if (!data)
            return data;

        let filtered = data;
        if (state.series)
            filtered = filtered.filter(show => show.series_name === state.series);
        if (state.genre)
            filtered = filtered.filter(show => show.genres?.includes(state.genre));
        if (completed)
            filtered = filtered.filter(show => show.bookmark != 'Finished');

        return filtered;
    }

    const filteredData = filterTVData(data);

    return {
        series: state.series, genre: state.genre, filter: dispatch, filterTitle, filterText,
        filteredData, handleHideCompleted, completed, toggleGenre
    };
}
