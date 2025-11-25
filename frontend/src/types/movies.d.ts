import type { Dispatch } from "react";
import type { MovieFilterAction } from "../movies/hooks/useFilters";

export interface MovieData {
    [key: string]: Movie[];
}

export interface EnrichedMovieData {
    [key: string]: SeriesEntry;
}

export interface SeriesEntry {
    movies: Movie[];
    anchorId?: string;
}

export interface MovieFilters {
    filterDirector: (director: string) => void,
    filterDate: (date: string) => void,
    filterGenres: (genre: string) => void
}

export interface Movie {
    movie_id: number;
    series: string;
    movie: string;
    genres: string[];
    release_date: string;
    directors: string[];
    watched: boolean;
    comments: string;
    organization: string;
}

export type MovieRowProps =
    | { headerOnly: true }
    | { movie: Movie, headerOnly?: false, onFilter: Dispatch<MovieFilterAction> };

export type MovieCardProps = { movie: Movie, onFilter: Dispatch<MovieFilterAction> };

export interface SeriesProps {
    name: string;
    entry: SeriesEntry;
    onFilter: Dispatch<MovieFilterAction>;
};
