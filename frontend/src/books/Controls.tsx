import type { ControlsProps } from "../types/books";
import useIsOnline from "../utils/elements/useIsOnline";

export default function Controls({ onNewBook, completed, toggleCompleted }: ControlsProps) {
    const isOnline = useIsOnline();
    return (
        <>
          <button className="btn-primary" onClick={onNewBook} disabled={!isOnline}>
            New Book
          </button>
          <label className="inline-flex select-none items-center gap-2 text-sm font-medium text-neutral-200">
            <input className="size-4 rounded border-neutral-500 bg-neutral-800 text-emerald-600 focus:ring-emerald-500"
                   type="checkbox" id="hide-completed-series" checked={completed}
                   onChange={toggleCompleted} />
              Hide Read
          </label>
        </>
    )
}
