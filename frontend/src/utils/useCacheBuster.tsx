import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const CacheBusterContext = createContext<{ version: number; bust: () => void } | null>(null);

export function CacheBusterProvider({ children }: { children: ReactNode }) {
    const [version, setVersion] = useState(0);
    const bust = useCallback(() => setVersion(v => v + 1), []);

    return (
        <CacheBusterContext.Provider value={{ version, bust }}>
            {children}
        </CacheBusterContext.Provider>
    );
}

export default function useCacheBuster(): readonly [number, () => void] {
    const ctx = useContext(CacheBusterContext);

    if (!ctx) {
        throw new Error("useCacheBuster must be used inside CacheBusterProvider");
    }

    return [ctx.version, ctx.bust] as const;
}
