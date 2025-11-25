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
import Controls from './Controls';
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
        <BaseUrlContext.Provider value={`${API_ORIGIN}/computer-games`}>
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
          <ProgressBar />
        } info={
          <InfoBlock param={developer} url="developer-info" />
        } menu={
          <GenresTree url="genres" onClick={toggleGenre} selected={genre} />
        } sidepanel={
          <SidePanel url="todo" open={true} />
        } scrubber={
          <AlphabetScrabber letters={letters} />
        } timeline={
          <Timeline selected={year} onSelect={(newYear) => filter({ type: 'SET_YEAR', value: newYear })} />
        } controls={
          <Controls onNewGame={() => openEditor("New Game", null, {})} completed={completed}
                    toggleCompleted={toggleCompleted} gridView={gridView} setGridView={setGridView} />
        }>
          <SettingsContext.Provider value={{ gridView: gridView }}>
            {data ? (
              Object.keys(data).map((franchise: string, index: number) => (
                <Franchise name={franchise} entry={data[franchise]} onFilter={filter} key={index} />
              ))
            ) : (
              <div className="ml-4 mt-4">Loading...</div>
            )}
          </SettingsContext.Provider>
        </PageShell>
    )
}