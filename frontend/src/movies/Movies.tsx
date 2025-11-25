import PageShell from '../PageShell';
import DynamicHeader from '../utils/DynamicHeader';
import ProgressBar from '../utils/ProgressBar';
import GenresTree from '../utils/GenresTree';
import AlphabetScrabber from '../utils/AlphabetScrabber';
import BaseUrlContext, { API_ORIGIN } from '../utils/BaseUrlContext';
import Series from './Series';
import Controls from './Controls';
import { EditorProvider } from './Editor';
import useEditor from '../utils/editor/useEditor';
import type { MovieData } from '../types/movies';
import useStandardQuery from '../utils/useStandardQuery';
import useAlphabetizedData from './hooks/useAlphabetizedData';
import useFilters from './hooks/useFilters';
import Timeline from '../utils/Timeline';
import { CacheBusterProvider } from '../utils/useCacheBuster';

export default function Movies() {
    return (
        <BaseUrlContext.Provider value={`${API_ORIGIN}/movies`}>
            <CacheBusterProvider>
                <EditorProvider>
                    <MoviesContent />
                </EditorProvider>
            </CacheBusterProvider>
        </BaseUrlContext.Provider>
    )
}

function MoviesContent() {
    const query = useStandardQuery<MovieData>('movies');
    const {
        filter, filterTitle, filterText, filteredData, genre, toggleGenre, organization,
        toggleOrganization, completed, year, handleHideCompleted
    } = useFilters(query.data);
    const { data, letters } = useAlphabetizedData(filteredData);
    const { openEditor } = useEditor();

    return (
        <PageShell header={
          <DynamicHeader title={filterTitle} dynamic={filterText} onCancel={() => filter({ type: 'RESET_FILTERS' })} />
        } progress={
          <ProgressBar />
        } menu={
          <>
            <GenresTree url={"genres"} onClick={toggleGenre} selected={genre} />
            <br />
            <GenresTree url={"organization"} onClick={toggleOrganization} selected={organization} />
          </>
        } scrubber={
          <AlphabetScrabber letters={letters} />
        } timeline={
          <Timeline selected={year} onSelect={(newYear) => filter({ type: 'SET_YEAR', value: newYear })} />
        } controls={
          <Controls onNewMovie={() => openEditor("New Movie", null, {})} completed={completed}
                    toggleCompleted={handleHideCompleted} />
        }>
          {data ? (
            Object.keys(data).map((series: string, index: number) => (
              <Series name={series} entry={data[series]} onFilter={filter} key={index} />
            ))
          ) : (
            <div className="text-center text-neutral-400">Loading...</div>
          )}
        </PageShell>
    )
}