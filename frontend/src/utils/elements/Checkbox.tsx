interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function Checkbox({ name, id, label, onChange, ...props }: InputProps) {

    return (
        <label className="inline text-sm font-medium text-neutral-300">
            <input type="checkbox" name={name} id={id} checked={props.checked} onChange={onChange}
                   className="ml-2 mt-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /> {label}
        </label>
    );
}