import { useReducer } from "react";
import type { SauceData } from "../types/hot-sauces";

type SauceFilterState = {
    pepper: string;
}

export type SauceFilterAction =
    | { type: 'SET_PEPPER'; value: string }
    | { type: 'RESET_FILTERS' };

const empty = { pepper: '' };

const reducer = (state: SauceFilterState, action: SauceFilterAction): SauceFilterState => {
    switch (action.type) {
        case 'SET_PEPPER':
            return { ...empty, pepper: action.value };
        case 'RESET_FILTERS':
            return empty;
        default:
            return state;
    }
}

/**
 * Manages the pepper filter for the hot sauce list and applies it to the
 * given data.
 *
 * @param data - Raw sauce data keyed by brand, or `undefined` while it's
 * still loading.
 * @returns `pepper` (the active filter value), `filter` (dispatch for
 * filter actions), `filterTitle`/`filterText` (for the active-filter
 * banner), `filteredData` (`data` with the pepper filter applied), and
 * `togglePepper` (sets the pepper filter, or clears it if already active).
 */
export default function useFilters(data: SauceData | undefined) {
    const [state, dispatch] = useReducer(reducer, empty);

    const togglePepper = (newPepper: string) => {
        if (state.pepper === newPepper) {
            dispatch({ type: 'RESET_FILTERS' });
            return;
        }
        dispatch({ type: 'SET_PEPPER', value: newPepper });
    }

    const filterText = state.pepper;
    const filterTitle = state.pepper ? 'Pepper' : '';

    const filterSauceData = (data: SauceData | undefined) => {
        if (!data) return data;

        const filterSauces = (predicate: (sauce: SauceData[string][number]) => boolean) => {
            const result: SauceData = {};
            for (const [series, sauces] of Object.entries(data!)) {
                const filtered = sauces.filter(predicate);
                if (filtered.length > 0) {
                    result[series] = filtered;
                }
            }
            return result;
        };

        if (state.pepper) data = filterSauces(sauce => sauce.peppers?.includes(state.pepper));

        return data;
    }

    const filteredData = filterSauceData(data);

    return {
        pepper: state.pepper, filter: dispatch, filterTitle, filterText, filteredData,
        togglePepper
    };
}
