type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export default function Input({ label, ...props }: InputProps) {
    const id_ = props.id || label && label.toLowerCase().replace(/\s+/g, '-');
    const name_ = props.name || label && label.toLowerCase().replace(/\s+/g, '-');

    return (
        <>
            {label &&
                <label htmlFor={id_} className="block text-sm font-medium text-neutral-300 mb-1">
                    {label}
                </label>
            }
            <input type={props.type} name={name_} id={id_} value={props.value} className="w-full rounded-md border border-blue-500 bg-neutral-700/50 p-2 text-left text-sm"
                   placeholder={props.placeholder} onChange={props.onChange} />
        </>
    );
}