import type { ControlsProps } from "../types/hot-sauces";

export default function Controls({ onNewSauce }: ControlsProps) {
    return (
        <button className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700" onClick={onNewSauce}>
          New Sauce
        </button>
    )
}
