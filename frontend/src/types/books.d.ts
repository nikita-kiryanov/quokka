import type { ChangeEventHandler, Dispatch } from "react";
import type { BookFilterAction } from "../books/hooks/useFilters";

export interface BooksData {
    [key: string]: Book[];
}

export interface EnrichedBookData {
    [key: string]: SeriesEntry;
}

export interface SeriesEntry {
    books: Book[];
    anchorId?: string;
}

export interface BookFilters {
    filterDirector: (author: string) => void,
    filterDate: (date: string) => void,
    filterGenres: (genre: string) => void
}

export interface Book {
    book_id: number;
    series: string;
    book: string;
    genres: string[];
    release_date: string;
    authors: string[];
    read: boolean;
    comments: string;
}

export type BookRowProps =
    | { headerOnly: true }
    | { book: Book, headerOnly?: false, onFilter: Dispatch<BookFilterAction> };

export type BookCardProps = { book: Book, onFilter: Dispatch<BookFilterAction> };

export interface SeriesProps {
    name: string;
    entry: SeriesEntry;
    onFilter: Dispatch<BookFilterAction>;
};

export interface ControlsProps {
    onNewBook: () => void;
    completed: boolean;
    toggleCompleted: ChangeEventHandler<HTMLInputElement>;
}
