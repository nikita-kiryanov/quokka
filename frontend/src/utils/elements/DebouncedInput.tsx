import { useEffect, useState } from 'react';
import useDebouncedValue from '../useDebouncedValue';
import Input from './Input';

/**
 * A text input that reports its value via `onDebouncedChange` only after
 * `delay` ms have passed without further changes (see `useDebouncedValue`).
 *
 * `initialValue` seeds both the visible text and the debounced value, and
 * suppresses the first `onDebouncedChange` call until the user actually
 * changes the input — see `useDebouncedValue` for the exact gating rule.
 *
 * Any other `DebouncedInputProps` (type, name, id, placeholder, etc.) are
 * forwarded as-is to the rendered `Input`.
 */
export default function DebouncedInput({ delay, initialValue = '', onDebouncedChange, ...inputProps }: DebouncedInputProps) {
    const [text, setText] = useState(initialValue);
    const debouncedText = useDebouncedValue(text, delay, initialValue);

    useEffect(() => {
        onDebouncedChange(debouncedText);
    }, [debouncedText]);

    return (
        <Input label="" value={text} onChange={(e) => setText(e.target.value)} {...inputProps} />
    );
}
