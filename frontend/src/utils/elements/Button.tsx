import useIsOnline from "./useIsOnline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
}

export default function Button({ onClick, text }: ButtonProps) {
    const isOnline = useIsOnline();
    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:opacity-70"
                disabled={!isOnline} onClick={onClick}>
            {text}
        </button>
    );
}