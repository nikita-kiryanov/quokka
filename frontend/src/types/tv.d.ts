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
    series: string;
    show: string;
    seasons: number;
    episodes: number;
    ended: boolean;
    bookmark: string;
    breakdown: ShowSeasonBreakdown[];
}

export type TVRow =
    | { headerOnly: true }
    | { show: Show, headerOnly?: false; anchorId?: string; };
