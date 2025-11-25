import slugify from "../slugify";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export default function Input({ label, id, name, ...props }: InputProps) {
    const id_ = id || (label && slugify(label));
    const name_ = name || (label && slugify(label));

    return (
        <>
            {label &&
                <label htmlFor={id_} className="block text-sm font-medium text-neutral-300 mb-1">
                    {label}
                </label>
            }
            <input {...props} name={name_} id={id_} className="w-full rounded-md border border-blue-500 bg-neutral-700/50 p-2 text-left text-sm" />
        </>
    );
}