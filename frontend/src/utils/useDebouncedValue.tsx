import { useEffect, useRef, useState } from "react";

/**
 * Returns a version of `value` that only updates after `delay` ms have passed
 * without `value` changing again.
 *
 * If `initialValue` is passed and differs from the starting `value`, the
 * returned value stays pinned to `initialValue` until `value` itself changes
 * for the first time (e.g. the user types into a bound input) — it will not
 * immediately debounce down to the starting `value`. This gate is based on
 * comparing `value` to what it was on mount, not on render/effect count, so
 * it's safe under React StrictMode's double-invoked effects.
 */
export default function useDebouncedValue<T>(value: T, delay: number, initialValue: T = value): T {
    const [debounced, setDebounced] = useState(initialValue);
    const mountValue = useRef(value).current;
    const awaitingFirstChange = useRef(initialValue !== value);

    const valueChanged = value !== mountValue;
    if (awaitingFirstChange.current && valueChanged) {
        awaitingFirstChange.current = false;
    }

    useEffect(() => {
        if (awaitingFirstChange.current)
            return;

        const timeout = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debounced;
}
