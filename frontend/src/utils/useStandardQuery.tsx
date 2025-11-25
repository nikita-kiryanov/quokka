import { useContext } from "react";
import BaseUrlContext from "./BaseUrlContext";
import { useQuery } from "@tanstack/react-query";

/**
 * Thin wrapper around `useQuery` that fetches JSON from a relative API endpoint.
 *
 * Resolves `urlkey` against the nearest `BaseUrlContext` value, so the caller
 * only needs to specify the path segment (e.g. `'movies'`, `'games'`).
 * Previous data is kept on screen while a refetch is in flight.
 *
 * @typeParam T — the expected shape of the JSON response.
 * @param urlkey — relative path appended to the base URL; also used as the
 *                 React Query cache key.
 * @returns the `UseQueryResult<T>` object from TanStack Query.
 *
 * @example
 * ```tsx
 * const query = useStandardQuery<MovieData>('movies');
 * ```
 */
export default function useStandardQuery<T>(urlkey: string) {
    const baseUrl = useContext(BaseUrlContext);
    const query = useQuery({
        queryKey: [urlkey], queryFn: async (): Promise<T> => {
            const url = new URL(urlkey, baseUrl);
            return fetch(url).then(res => res.json());
        },
        placeholderData: (previousData) => previousData
    });

    return query;
}