import DismissableTag from "./DismissableTag";
import { useState } from "react";
import FetchedSuggestions from "./FetchedSuggestions";

export default function TagInputs({ items, search, label, onChange }: TagInputs) {
    const [tokens, setTokens] = useState(items.map(item => item?.trim()));
    const [input, setInput] = useState('');

    const anchorName = `--${search}`;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            e.preventDefault();
            setTokens([...tokens, input.trim()]);
            setInput('');
            onChange([...tokens, input.trim()]);
        } else if (e.key === 'Backspace' && input === '' && tokens.length > 0) {
            e.preventDefault();
            setInput(tokens[tokens.length - 1]);
            setTokens(tokens.slice(0, -1));
            onChange(tokens.slice(0, -1));
        }
    };

    const onDismiss = (item: string) => {
        setTokens(tokens.filter(token => token !== item));
        onChange(tokens.filter(token => token !== item));
    };

    const onAcceptSuggestion = (item: string) => {
        if (!tokens.includes(item)) {
            setTokens([...tokens, item]);
            onChange([...tokens, item]);
        }
        setInput('');
    }

    const focusInput = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            const inputElement = e.currentTarget.querySelector('input');
            if (inputElement) {
                inputElement.focus();
            }
        }
    };

    return (
        <>
            <label className="block text-sm font-medium text-neutral-300 mb-1">{label}</label>
            <div onClick={focusInput} className="border border-blue-500 rounded-md px-2 py-1 flex flex-wrap gap-1 [anchor-scope:all]">
                {tokens.map((token: string, index: number) => (
                    <DismissableTag key={index} text={token} onDismiss={onDismiss} />
                ))}
                <input className="ml-1 px-2 py-1 bg-neutral-700 text-neutral-100 outline-none flex-auto min-w-16 max-w-full field-sizing-content"
                       type="text" style={{ anchorName, } as React.CSSProperties} value={input}
                       onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />
                <div className="anchor fixed mt-1 mr-1 text-neutral-500 cursor-pointer [position-area:bottom_center]"
                     style={{ positionAnchor: anchorName, } as React.CSSProperties}>
                    <FetchedSuggestions url={search} input={input} onClick={onAcceptSuggestion} />
                </div>
            </div>
        </>
    )
}