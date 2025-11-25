type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export default function Checkbox({ name, id, label, onChange, ...props }: InputProps) {
    const id_ = id || label.toLowerCase().replace(/\s+/g, '-');
    const name_ = name || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <label className="inline text-sm font-medium text-neutral-300">
            <input type="checkbox" name={name_} id={id_} checked={props.checked} onChange={onChange}
                   className="ml-2 mt-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /> {label}
        </label>
    );
}