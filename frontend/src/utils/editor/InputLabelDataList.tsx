export default function InputLabelDataList({ label, name, id, value, onChange, suggestions }: InputLabelDataListProps) {
    return (
        <>
            <label htmlFor={id} className="block text-sm font-medium text-neutral-300 mb-1">
                {label}
            </label>
            <input className="w-full rounded-md border border-blue-500 bg-neutral-700/50 p-2 text-left text-sm"
                   type="text" name={name} id={id} value={value} onChange={onChange} list={`${id}-list`} />
            {suggestions ?
                <datalist id={`${id}-list`}>
                    {suggestions.map((f: { suggestion: string }, index: number) => (
                        <option key={index} value={f.suggestion} />
                    ))}
                </datalist> :
                null}
        </>
    );
}