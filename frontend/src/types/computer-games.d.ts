import type { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import type { GameFilterAction } from "../computer_games/hooks/useFilters";

export interface GameData {
    [key: string]: {
        [key: string]: Game[]
    };
}

export interface SeriesEntry {
    games: Game[];
}

export interface FranchiseEntry {
    series: Record<string, SeriesEntry>;
    anchorId?: string;
}

export interface EnrichedGameData {
    [key: string]: FranchiseEntry;
}

export interface FranchiseProps {
    name: string;
    entry: FranchiseEntry;
    onFilter: Dispatch<GameFilterAction>;
}

export interface SeriesProps {
    isUnderFranchise: boolean;
    name: string;
    entry: SeriesEntry;
    onFilter: Dispatch<GameFilterAction>;
};

export interface ControlsProps {
    onNewGame: () => void;
    completed: boolean;
    toggleCompleted: ChangeEventHandler<HTMLInputElement>;
    gridView: boolean;
    setGridView: Dispatch<SetStateAction<boolean>>;
}

export type GameRowProps =
    | { headerOnly: true }
    | { game: Game, headerOnly?: false, onFilter: Dispatch<GameFilterAction> };

export type GameCardProps = { game: Game, onFilter: Dispatch<GameFilterAction> };

export interface Game {
    game_id: number;
    series: string;
    game: string;
    is_dlc: boolean;
    game_genres: string[];
    content: string[];
    initial_release_date: string;
    developers: string[];
    played: boolean;
    dlcs_played: boolean;
    comments: string;
    chronology_date: string;
    dlc_for: number | null;
    dlc_for_name: string | null;
    franchise: string;
    remake_for: number | null;
    remake_for_name: string | null;
    sort_order: number;
};

export interface GameGenre {
    id: number;
    name: string;
}
