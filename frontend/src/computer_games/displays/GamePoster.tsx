import type { Dispatch } from "react";
import type { Game } from "../../types/computer-games";
import type { GameFilterAction } from "../hooks/useFilters";
import ListOfLinks from "../../utils/ListOfLinks";
import useOpenPoster from "../hooks/useOpenPoster";
import Poster from "../Poster";

export default function GamePoster({game, onFilter}: {game: Game, onFilter: Dispatch<GameFilterAction>}) {
    const { openGameId, toggle } = useOpenPoster();
    const showDetails = openGameId === game.game_id;

    return (
        <>
          <Poster game={game} onClick={() => toggle(game.game_id)}
                  className={[
                      "w-auto", "object-contain", game.is_dlc ? 'h-50' : 'h-75',
                      game.played ? "grayscale-0" : "grayscale", "hover:grayscale-0",
                      "transition-all", "duration-300"
                  ].join(" ")}
                  style={{ anchorName: '--' + `game-poster-${game.game_id}`, } as React.CSSProperties} />
          <div className={"absolute [position-area:bottom_center] z-30 mt-2 bg-neutral-800 border-2 p-2 w-max origin-bottom transition duration-150 ease-out "
                          + (showDetails ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none")}
               style={{ positionAnchor: '--' + `game-poster-${game.game_id}`, } as React.CSSProperties}>
            <svg viewBox="0 0 16 8" strokeWidth={2} strokeLinejoin="round" className="absolute -top-2 left-1/2 w-4 h-2 -translate-x-1/2 overflow-visible fill-neutral-800 stroke-current">
              <path d="M0 8 L8 0 L16 8" />
            </svg>
            <h3 className="mb-2 flex items-center gap-1 font-semibold">
              <span>{game.played ? '✅' : '🟥'}</span>
              <span>{game.game}</span>
            </h3>
            <dl className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1">
              <dt className="text-neutral-400">Release</dt>
              <dd>{game.initial_release_date}</dd>
              <dt className="text-neutral-400">Genres</dt>
              <dd>
                <ListOfLinks items={game.game_genres} onClick={
                  (genre: string) => onFilter({ type: 'SET_GENRE', value: genre })
                } />
              </dd>
              <dt className="text-neutral-400">Content</dt>
              <dd>
                <ListOfLinks items={game.content} onClick={
                  (content: string) => onFilter({ type: 'SET_CONTENT', value: content })
                } />
              </dd>
              <dt className="text-neutral-400">Developers</dt>
              <dd>
                <ListOfLinks items={game.developers} onClick={
                  (developer: string) => onFilter({ type: 'SET_DEVELOPER', value: developer })
                } />
              </dd>
            </dl>
            {game.comments &&
              <p className="mt-2 italic text-neutral-300">{game.comments}</p>
            }
          </div>
        </>
    );
}
