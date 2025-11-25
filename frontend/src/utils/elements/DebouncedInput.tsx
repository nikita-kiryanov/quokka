import { useEffect, useRef } from 'react';
import Input from './Input';

/**
 * A text input that reports its value via `onDebouncedChange` only after
 * `delay` ms have passed without further changes.
 *
 * Any other `DebouncedInputProps` (type, name, id, placeholder, etc.) are
 * forwarded as-is to the rendered `Input`.
 */
export default function DebouncedInput({ delay, onDebouncedChange, ...inputProps }: DebouncedInputProps) {
    const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timeout.current), []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => onDebouncedChange(value), delay);
    };

    return (
        <Input onChange={handleChange} {...inputProps} />
    );
}
