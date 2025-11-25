import { createContext, useContext } from "react";

export const EditorContext = createContext<EditorContextValue | null>(null);

export default function useEditor() {
    const context = useContext(EditorContext);

    if (!context) {
        throw new Error("useEditor must be used inside EditorProvider");
    }

    return context;
}
