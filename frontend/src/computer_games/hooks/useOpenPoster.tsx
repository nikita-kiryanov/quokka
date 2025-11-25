import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const OpenPosterContext = createContext<{
    openGameId: number | null;
    toggle: (gameId: number) => void;
} | null>(null);

export function OpenPosterProvider({ children }: { children: ReactNode }) {
    const [openGameId, setOpenGameId] = useState<number | null>(null);
    const toggle = useCallback((gameId: number) => {
        setOpenGameId(current => current === gameId ? null : gameId);
    }, []);

    return (
        <OpenPosterContext.Provider value={{ openGameId, toggle }}>
            {children}
        </OpenPosterContext.Provider>
    );
}

export default function useOpenPoster() {
    const ctx = useContext(OpenPosterContext);

    if (!ctx) {
        throw new Error("useOpenPoster must be used inside OpenPosterProvider");
    }

    return ctx;
}
