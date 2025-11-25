interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
}

export default function Button({ onClick, text }: ButtonProps) {
    return (
        <button onClick={onClick} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded">
            {text}
        </button>
    );
}