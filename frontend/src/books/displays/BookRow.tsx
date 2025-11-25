import type { BookRowProps } from "../../types/books";
import useEditor from "../../utils/editor/useEditor";
import ListOfLinks from "../../utils/ListOfLinks";
import ClickableDate from "../../utils/ClickableDate";

export default function BookRow(props: BookRowProps) {
    const { openEditor } = useEditor();

    if (props.headerOnly) {
        return (
            <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Book</th>
                <th className="px-6 py-3">Genres</th>
                <th className="px-6 py-3">Release Date</th>
                <th className="px-6 py-3">Authors</th>
                <th className="px-6 py-3">Edit</th>
            </tr>
        );
    }

    const { book, onFilter } = props;

    return (
        <tr className="hidden bg-neutral-700 transition-colors hover:bg-neutral-600 md:table-row">
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{book.book_id}</td>
            <td className={"whitespace-nowrap px-6 py-2 text-neutral-100"
                           + (book.read ? " before:content-['✅']" : " before:content-['🟥']")}>
                {book.book}
                {book.comments &&
                    <span className="relative top-0.5 select-none text-lg text-blue-500" title={book.comments}> ⓘ</span>
                }
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
                <ListOfLinks items={book.genres} onClick={
                    (genre: string) => onFilter({ type: 'SET_GENRE', value: genre })
                } />
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
                <ClickableDate date={book.release_date} onClick={
                    (year: string) => onFilter({ type: 'SET_YEAR', value: year })
                } />
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
                <ListOfLinks items={book.authors} onClick={
                    (author: string) => onFilter({ type: 'SET_AUTHOR', value: author })
                } />
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
                <button className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-700" type="button" onClick={() => openEditor(book.book, book.book_id, book)}>Edit</button>
            </td>
        </tr>
    );
};
