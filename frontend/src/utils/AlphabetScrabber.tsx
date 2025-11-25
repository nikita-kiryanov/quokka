import { useCallback, useRef, useState } from "react";

/** Touch/mouse-friendly vertical alphabet strip that scrolls to the corresponding section on release. */
export default function AlphabetScrabber({letters}: {
    /** Letters to display in the strip */
    letters?: string[]
}) {
    const [activeLetter, setActiveLetter] = useState<string | null>(null);
    const currentRef = useRef<string | null>(null);
    const isDraggingRef = useRef(false);

    const getLetterFromPoint = useCallback((x: number, y: number) => {
        const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-letter]');
        return el?.dataset.letter ?? null;
    }, []);

    const updateFromPoint = useCallback((x: number, y: number) => {
        const letter = getLetterFromPoint(x, y);
        if (letter) {
            currentRef.current = letter;
            setActiveLetter(letter);
        }
    }, [getLetterFromPoint]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        isDraggingRef.current = true;
        updateFromPoint(e.clientX, e.clientY);
    }, [updateFromPoint]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        updateFromPoint(e.clientX, e.clientY);
    }, [updateFromPoint]);

    const handlePointerUp = useCallback(() => {
        isDraggingRef.current = false;
        setActiveLetter(null);
        const letter = currentRef.current;
        if (letter) {
            document.getElementById(`${letter}`)?.scrollIntoView({ behavior: 'smooth' });
            currentRef.current = null;
        }
    }, []);

    return (
        <>
            <ul className={`flex flex-col justify-center gap-1 h-full overflow-x-auto [&>li]:leading-none select-none touch-none`}
                onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
                {letters?.map(letter => (
                    <li key={letter} style={{ anchorName: '--' + letter, } as React.CSSProperties} data-letter={letter}>
                        <span>{letter}</span>
                    </li>
                ))}
            </ul>
            {activeLetter &&
                <div style={{ positionAnchor: '--' + activeLetter, } as React.CSSProperties} className="fixed mt-1 mr-1 text-neutral-500 [position-area:left_center] z-30 rounded-lg bg-neutral-800 px-3 py-2 text-4xl font-bold shadow-lg border border-blue-500 before:absolute before:inset-0 before:rounded-lg pe-9">
                    {activeLetter}
                </div>
            }
        </>
    );
}