import ListOfLinks from "../../utils/ListOfLinks";
import ClickableDate from "../../utils/ClickableDate";
import Poster from "../Poster";
import type { GameCardProps } from "../../types/computer-games";
import useEditor from "../../utils/editor/useEditor";
import Button from "../../utils/elements/Button";

export default function GameCard(props: GameCardProps) {
    const { game, onFilter } = props;
    const { openEditor } = useEditor();
    const mobileCardClass = game.is_dlc
        ? 'my-2 mr-2 ml-8 rounded-lg border border-neutral-600 bg-neutral-800 p-3 shadow-sm'
        : 'm-2 rounded-lg border border-neutral-600 bg-neutral-800 p-3 shadow-sm';
    const onEdit = () => openEditor(game.game, game.game_id, game);

    return (
        <article className={mobileCardClass}>
          <div className="flex gap-3">
            <div className="w-20 h-30 shrink-0 overflow-hidden rounded bg-neutral-700">
                <Poster game={game} className="h-full w-full object-contain" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold text-neutral-100">
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">#{game.game_id}</span>
                    <span className="flex items-center gap-1">
                      {game.played ? '✅' : '🟥'}
                      <span>{game.game}</span>
                    </span>
                    {game.comments && <span className="relative top-px select-none text-base text-blue-500" title={game.comments}>ⓘ</span>}
                  </h3>
                </div>
                <Button onClick={() => onEdit()} text="Edit" />
              </div>

              <dl className="grid grid-cols-[92px_1fr] gap-x-2 gap-y-2 text-sm">
                <dt className="text-neutral-400">Release</dt>
                <dd className="text-neutral-100">
                  <ClickableDate date={game.initial_release_date} onClick={(year) => onFilter({ type: 'SET_YEAR', value: year })} />
                </dd>
                <dt className="text-neutral-400">Genres</dt>
                <dd className="text-neutral-100">
                  <ListOfLinks items={game.game_genres} onClick={(genre) => onFilter({ type: 'SET_GENRE', value: genre })} />
                </dd>
                <dt className="text-neutral-400">Content</dt>
                <dd className="text-neutral-100">
                  <ListOfLinks items={game.content} onClick={(content) => onFilter({ type: 'SET_CONTENT', value: content })} />
                </dd>
                <dt className="text-neutral-400">Developers</dt>
                <dd className="text-neutral-100">
                  <ListOfLinks items={game.developers} onClick={(dev) => onFilter({ type: 'SET_DEVELOPER', value: dev })} />
                </dd>
              </dl>
            </div>
          </div>
        </article>
    );
};
