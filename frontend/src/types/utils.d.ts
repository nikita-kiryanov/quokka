interface DynamicHeader {
    /** The main heading text */
    title: string;
    /** Optional subtitle displayed in red alongside a dismiss button. Hidden when empty. */
    dynamic: string;
    /** Called when the user clicks the dismiss button next to the dynamic subtitle */
    onCancel: () => void;
}

interface ProgressBarProps {
    /** API endpoint to fetch statistics from */
    url: string;
    /** Key in the response object representing completed items */
    done: string;
    /** Key in the response object representing remaining items */
    todo: string;
    /** Key in the response object representing the total count */
    total: string;
}

interface DismissableTag {
    text: string;
    onDismiss: (text: string) => void;
}

interface TagInputs {
    search: "genre" | "content" | "developer" | "directors" | "pepper";
    items: string[];
    label?: string;
    onChange: (newData: string[]) => void;
}

interface FetchedSuggestions {
    url: string;
    input: string;
    onClick: (item: string) => void;
}

interface ListOfLinks {
    /** Strings to render as clickable links */
    items: string[];
    /** Called with the item text when a link is clicked */
    onClick: (item: string) => void;
}

interface ClickableDate {
    /** Date string in YYYYMMDD form */
    date: string;
    /** Called with the year when the year link is clicked */
    onClick: (year: string) => void;
}

interface GenreTuple {
    primary: string;
    secondary: string;
}

interface GenresTree {
    /** API endpoint to fetch the genre hierarchy from */
    url: string,
    /** Called with the genre name when the user clicks a genre link */
    onClick: (genre: string) => void;
    /** Currently selected genre name — used to highlight the active item */
    selected: string;
}

interface InfoBlockProps {
    /** API endpoint to fetch info text from */
    url: string;
    /** Name to look up — when absent, the block renders nothing */
    param?: string;
}

interface SidePanel {
    /** API endpoint to fetch the list data from */
    url: string;
    /** Whether the panel is initially visible */
    open: boolean;
}

type EditorContextValue = {
    openEditor: (title: string, id: number | null, content: any) => void;
    closeEditor: () => void;
}

interface InputLabelDataListProps {
    label: string;
    name: string;
    id: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    suggestions?: { suggestion: string }[];
}

interface ArtFetcherProps {
    subject: string;
    current: string;
    fetch: (url: string) => Promise<any>;
    onSelect: (url: string?) => void;
    placeholder?: string;
}

type DebouncedInputProps = {
    delay: number;
    initialValue?: string;
    onDebouncedChange: (value: string) => void;
} & Pick<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'id' | 'placeholder'>;
