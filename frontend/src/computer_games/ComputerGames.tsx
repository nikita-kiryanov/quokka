import PageShell from '../PageShell';
import DynamicHeader from '../utils/DynamicHeader';
import ProgressBar from '../utils/ProgressBar';
import InfoBlock from '../utils/InfoBlock';
import GenresTree from '../utils/GenresTree';
import SidePanel from '../utils/SidePanel';
import AlphabetScrabber from '../utils/AlphabetScrabber';
import BaseUrlContext, { API_ORIGIN } from '../utils/BaseUrlContext';
import Timeline from '../utils/Timeline';
import Franchise from './Franchise';
import { EditorProvider } from './Editor';
import useEditor from '../utils/editor/useEditor';
import type { GameData } from '../types/computer-games';
import useFilters from './hooks/useFilters';
import useStandardQuery from '../utils/useStandardQuery';
import useAlphabetizedData from './hooks/useAlphabetizedData';
import { CacheBusterProvider } from '../utils/useCacheBuster';
import { OpenPosterProvider } from './hooks/useOpenPoster';
import { useState } from 'react';
import { SettingsContext } from './SettingsContext';

export default function ComputerGames() {
    return (
        <BaseUrlContext.Provider value={`${API_ORIGIN}/computer-games/`}>
            <CacheBusterProvider>
                <EditorProvider>
                    <OpenPosterProvider>
                        <ComputerGamesContent />
                    </OpenPosterProvider>
                </EditorProvider>
            </CacheBusterProvider>
        </BaseUrlContext.Provider>
    )
}

function ComputerGamesContent() {
    const [gridView, setGridView] = useState(false);
    const query = useStandardQuery<GameData>('games');
    const {
        developer, genre, year, filter, toggleGenre, filterTitle, filterText, filteredData,
        completed, toggleCompleted
    } = useFilters(query.data);
    const {data, letters} = useAlphabetizedData(filteredData);
    const { openEditor } = useEditor();

    return (
        <PageShell header={
          <DynamicHeader title={filterTitle} dynamic={filterText} onCancel={() => filter({ type: 'RESET_FILTERS' })} />
        } progress={
          <ProgressBar url="stats" done="played_games" todo="unplayed_games" total="total_games" />
        } info={
          <InfoBlock param={developer} url="developer-info" />
        } menu={
          <GenresTree url="genres" onClick={toggleGenre} selected={genre} />
        } sidepanel={
          <SidePanel url="todo" open={true} />
        } scrubber={
          <AlphabetScrabber letters={letters} />
        }>
          <div className="mt-4 px-2">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-4">
              <button className="btn-primary" onClick={() => {openEditor("New Game", null, {})}}>
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
            </div>
          </div>
          <div className="hidden lg:block mt-4">
            <Timeline selected={year} onSelect={(newYear) => filter({ type: 'SET_YEAR', value: newYear })} />
          </div>
          <SettingsContext.Provider value={{ gridView: gridView }}>
            {data ? (
              Object.keys(data).map((franchise: string, index: number) => (
                <Franchise name={franchise} entries={data[franchise]} onFilter={filter} key={index} />
              ))
            ) : (
              <div className="ml-4 mt-4">Loading...</div>
            )}
          </SettingsContext.Provider>
        </PageShell>
    )
}