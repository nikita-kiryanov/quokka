import slugify from "../slugify";

export default function InputLabelDataList({ label, name, id, value, onChange, suggestions }: InputLabelDataListProps) {
    const id_ = id || slugify(label);
    const name_ = name || slugify(label);

    return (
        <>
            <label htmlFor={id_} className="block text-sm font-medium text-neutral-300 mb-1">
                {label}
            </label>
            <input className="w-full rounded-md border border-blue-500 bg-neutral-700/50 p-2 text-left text-sm"
                   type="text" name={name_} id={id_} value={value} onChange={onChange} list={`${id_}-list`} />
            {suggestions ?
                <datalist id={`${id_}-list`}>
                    {suggestions.map((f: { suggestion: string }, index: number) => (
                        <option key={index} value={f.suggestion} />
                    ))}
                </datalist> :
                null}
        </>
    );
}