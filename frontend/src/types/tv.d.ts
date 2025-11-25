import type { ChangeEventHandler } from "react";

export interface AlphabetizedTV {
    show: Show;
    anchorId?: string;
}

export interface ShowEpisode {
    episode: number;
    watched: boolean;
}

export interface ShowSeasonBreakdown {
    season: number;
    episodes: ShowEpisode[];
}

export interface Show {
    show_id: number;
    series_name: string;
    show: string;
    seasons: number;
    ended: boolean;
    bookmark: string;
    genres: string[];
    breakdown: ShowSeasonBreakdown[];
}

export type TVRow =
    | { headerOnly: true }
    | { show: Show, headerOnly?: false; onFilter: Dispatch<TVFilterAction>; anchorId?: string; };

export interface ControlsProps {
    onNewShow: () => void;
    completed: boolean;
    toggleCompleted: ChangeEventHandler<HTMLInputElement>;
}
