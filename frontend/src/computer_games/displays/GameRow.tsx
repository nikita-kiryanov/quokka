import type { GameRowProps } from "../../types/computer-games";
import useEditor from "../../utils/editor/useEditor";
import ListOfLinks from "../../utils/ListOfLinks";
import ClickableDate from "../../utils/ClickableDate";

export default function GameRow(props: GameRowProps) {
    const { openEditor } = useEditor();

    if (props.headerOnly) {
        return (
            <tr>
                <th className="px-2 py-3">ID</th>
                <th className="px-2 py-3">Game</th>
                <th className="px-2 py-3">Genres</th>
                <th className="px-2 py-3">Content</th>
                <th className="px-2 py-3">Release Date</th>
                <th className="px-2 py-3">Developers</th>
                <th className="px-2 py-3">Edit</th>
            </tr>
        );
    }

    const { game, onFilter } = props;
    const onEdit = () => openEditor(game.game, game.game_id, game);

    return (
        <tr className="hidden bg-neutral-700 transition-colors hover:bg-neutral-600 md:table-row">
            <td className="whitespace-nowrap px-2 py-2 text-neutral-100">{game.game_id}</td>
            <td className={"whitespace-nowrap px-2 py-2 text-neutral-100"
                           + (game.is_dlc ? ' indent-4' : '')
                           + (game.played ? " before:content-['✅']" : " before:content-['🟥']")}>
                {game.game}
                {game.comments &&
                    <span className="relative top-0.5 select-none text-lg text-blue-500" title={game.comments}> ⓘ</span>
                }
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-neutral-100">
                <ListOfLinks items={game.game_genres} onClick={
                (genre) => onFilter({ type: 'SET_GENRE', value: genre })
                } />
            </td>
            <td className="px-2 py-2 text-neutral-100">
                <ListOfLinks items={game.content} onClick={
                (content) => onFilter({ type: 'SET_CONTENT', value: content })
                } />
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-neutral-100">
                <ClickableDate date={game.initial_release_date} onClick={
                (year) => onFilter({ type: 'SET_YEAR', value: year })
                } />
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-neutral-100">
                <ListOfLinks items={game.developers} onClick={
                (developer) => onFilter({ type: 'SET_DEVELOPER', value: developer })
                } />
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-neutral-100">
                <button className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-700" type="button" onClick={() => onEdit()}>Edit</button>
            </td>
        </tr>
    );
};
