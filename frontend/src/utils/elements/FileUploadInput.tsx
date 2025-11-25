import type { ChangeEvent } from "react";
import Input from "./Input";

interface FileUploadInputProps {
    /** Called with the uploaded file encoded as a base64 data URL */
    onChange: (base64: string) => void;
    /** Label shown next to the input */
    label: string;
}

export default function FileUploadInput({ onChange, label }: FileUploadInputProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onChange(reader.result as string);
            }
            reader.readAsDataURL(file);
        }
    };

    return (
        <Input type="file" name="file-upload" id="i-file-upload" label={label} accept="image/*"
               onChange={handleChange} />
    );
}
