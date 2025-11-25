import type { ControlsProps } from "../types/computer-games";

export default function Controls({ onNewGame, completed, toggleCompleted, gridView, setGridView }: ControlsProps) {
    return (
        <>
          <button className="btn-primary" onClick={onNewGame}>
            New Game
          </button>
          <label className="checkbox-label">
            <input className="checkbox-input" type="checkbox" id="hide-completed-series"
                   checked={completed} onChange={toggleCompleted} />
            Hide Played
          </label>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Row view" aria-pressed={!gridView}
                    onClick={() => setGridView(false)}
                    className={!gridView ? "text-white" : "text-neutral-500 hover:text-neutral-300"}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            </button>
            <button type="button" aria-label="Grid view" aria-pressed={gridView}
                    onClick={() => setGridView(true)}
                    className={gridView ? "text-white" : "text-neutral-500 hover:text-neutral-300"}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </button>
          </div>
        </>
    )
}
