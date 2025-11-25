import type { ControlsProps } from "../types/tv";

export default function Controls({ onNewShow, completed, toggleCompleted }: ControlsProps) {
    return (
        <>
          <button className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700" onClick={onNewShow}>
            New Show
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
