import type { ControlsProps } from "../types/movies";
import useIsOnline from "../utils/elements/useIsOnline";

export default function Controls({ onNewMovie, completed, toggleCompleted }: ControlsProps) {
    const isOnline = useIsOnline();
    return (
        <>
          <button className="btn-primary" onClick={onNewMovie} disabled={!isOnline}>
            New Movie
          </button>
          <label className="inline-flex select-none items-center gap-2 text-sm font-medium text-neutral-200">
            <input className="size-4 rounded border-neutral-500 bg-neutral-800 text-emerald-600 focus:ring-emerald-500"
                   type="checkbox" id="hide-completed-series" checked={completed}
                   onChange={toggleCompleted} />
              Hide Watched
          </label>
        </>
    )
}
