import type { MovieRowProps } from "../../types/movies";
import useEditor from "../../utils/editor/useEditor";
import ListOfLinks from "../../utils/ListOfLinks";
import ClickableDate from "../../utils/ClickableDate";
import Button from "../../utils/elements/Button";

export default function MovieRow(props: MovieRowProps) {
    const { openEditor } = useEditor();

    if (props.headerOnly) {
        return (
            <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Movie</th>
                <th className="px-6 py-3">Genres</th>
                <th className="px-6 py-3">Release Date</th>
                <th className="px-6 py-3">Director</th>
                <th className="px-6 py-3">Edit</th>
            </tr>
        );
    }

    const { movie, onFilter } = props;

    return (
        <tr className="hidden bg-neutral-700 transition-colors hover:bg-neutral-600 md:table-row">
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{movie.movie_id}</td>
            <td className={"whitespace-nowrap px-6 py-2 text-neutral-100"
                           + (movie.watched ? " before:content-['✅']" : " before:content-['🟥']")}>
                {movie.movie}
                {movie.comments &&
                    <span className="relative top-0.5 select-none text-lg text-blue-500" title={movie.comments}> ⓘ</span>
                }
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
                <ListOfLinks items={movie.genres} onClick={
                (genre: string) => onFilter({ type: 'SET_GENRE', value: genre })
                } />
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
                <ClickableDate date={movie.release_date} onClick={
                (year: string) => onFilter({ type: 'SET_YEAR', value: year })
                } />
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
                <ListOfLinks items={movie.directors} onClick={
                (director: string) => onFilter({ type: 'SET_DIRECTOR', value: director })
                } />
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
                <Button onClick={() => openEditor(movie.movie, movie.movie_id, movie)} text="Edit" />
            </td>
        </tr>
    );
};
