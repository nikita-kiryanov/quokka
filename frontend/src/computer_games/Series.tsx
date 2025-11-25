import GameRow from "./displays/GameRow";
import type { SeriesProps, Game } from "../types/computer-games";
import { useContext } from "react";
import { SettingsContext } from "./SettingsContext";
import GamePoster from "./displays/GamePoster";
import GameCard from "./displays/GameCard";

export default function Series({ name, isUnderFranchise, entry, onFilter }: SeriesProps) {
    const settings = useContext(SettingsContext);
    const { games } = entry;

    return (
      <>
        {isUnderFranchise && <h2 className="text-2xl scroll-mt-18">{name}</h2>}
        <div className="hidden md:block">
          {!settings.gridView && (
            <table className="table-auto w-full text-sm text-left">
              <thead className="bg-neutral-800 text-neutral-400 uppercase tracking-wider text-xs font-semibold">
                <GameRow headerOnly={true} />
              </thead>
              <tbody className="divide-y divide-neutral-600">
                {games.map((game: Game) => {
                  return <GameRow key={game.game_id} game={game} onFilter={onFilter} />;
                })}
              </tbody>
            </table>
          )}
          {settings.gridView && (
            <div className="flex flex-row flex-wrap items-end gap-4">
              {games.map((game: Game) => {
                return <GamePoster key={game.game_id} game={game} onFilter={onFilter} />;
              })}
            </div>
          )}
        </div>
        <div className="md:hidden">
            {games.map((game: Game) => {
              return <GameCard key={game.game_id} game={game} onFilter={onFilter} />;
            })}
        </div>
      </>
    )
};
