import slugify from "../slugify";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export default function Checkbox({ name, id, label, ...props }: InputProps) {
    const id_ = id || slugify(label);
    const name_ = name || slugify(label);

    return (
        <label className="inline text-sm font-medium text-neutral-300">
            <input {...props} type="checkbox" name={name_} id={id_}
                   className="ml-2 mt-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /> {label}
        </label>
    );
}