import type { ControlsProps } from "../types/hot-sauces";
import useIsOnline from "../utils/elements/useIsOnline";

export default function Controls({ onNewSauce }: ControlsProps) {
    const isOnline = useIsOnline();
    return (
        <button className="btn-primary" onClick={onNewSauce} disabled={!isOnline}>
          New Sauce
        </button>
    )
}
