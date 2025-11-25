import { createContext, useContext } from "react";

/**
 * Provides the base API URL to the component tree so that child components
 * can build endpoint URLs without hardcoding or prop-drilling the origin.
 *
 * Setup:
 *   Wrap a feature root with `<BaseUrlProvider>` (or the raw
 *   `<BaseUrlContext.Provider>`), passing the full base URL for that
 *   feature's API surface — e.g. `${API_ORIGIN}/movies/`.
 *
 * Consuming:
 *   Call `useBaseUrl()` to get the base URL as a `URL` object, or
 *   `useBaseUrl(path)` to resolve a relative path against it.
 *
 * Exports:
 *   - `API_ORIGIN`      — protocol + host of the API server.
 *   - `BaseUrlProvider`  — convenience wrapper that sets the context value.
 *   - `useBaseUrl`       — hook to read and resolve URLs from the context.
 *   - default export     — the raw React context (for direct `.Provider` use).
 */

export const API_ORIGIN = import.meta.env.DEV ? `http://${window.location.hostname}:3000` : window.location.origin;

const BaseUrlContext = createContext<string>('');

interface BaseUrlContext {
    baseUrl: string;
    children: React.ReactNode;
}

/**
 * Convenience provider that sets `BaseUrlContext` to the given `baseUrl`.
 */
export function BaseUrlProvider({ baseUrl, children }: BaseUrlContext) {
    return (
        <BaseUrlContext.Provider value={baseUrl}>
            {children}
        </BaseUrlContext.Provider>
    );
}

/**
 * Returns a `URL` built from the nearest `BaseUrlContext` value.
 *
 * @param path — optional relative path resolved against the base URL.
 *               When omitted, returns the base URL itself.
 */
export function useBaseUrl(path?: string) {
    const baseUrl = useContext(BaseUrlContext);

    if (path === undefined) {
        return new URL(baseUrl);
    }

    return new URL(path, baseUrl);
}

export default BaseUrlContext;