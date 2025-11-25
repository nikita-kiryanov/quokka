import { useState } from "react";
import type { Show } from "../../types/tv";

export default function useFilters(data: Show[] | undefined) {
    const [completed, setCompleted] = useState<boolean>(false);

    const handleHideCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompleted(e.target.checked);
    }

    const filterTVData = (data: Show[] | undefined) => {
        if (!data) return data;

        return completed ? data.filter(show => show.bookmark != 'Finished') : data;
    }

    const filteredData = filterTVData(data);

    return { filteredData, handleHideCompleted, completed };
}
