import PageShell from '../PageShell';
import DynamicHeader from '../utils/DynamicHeader';
import ProgressBar from '../utils/ProgressBar';
import GenresTree from '../utils/GenresTree';
import AlphabetScrabber from '../utils/AlphabetScrabber';
import BaseUrlContext, { API_ORIGIN } from '../utils/BaseUrlContext';
import Series from './Series';
import { EditorProvider } from './Editor';
import useEditor from '../utils/editor/useEditor';
import type { MovieData } from '../types/movies';
import useStandardQuery from '../utils/useStandardQuery';
import useAlphabetizedData from './hooks/useAlphabetizedData';
import useFilters from './hooks/useFilters';
import Timeline from '../utils/Timeline';

export default function Movies() {
    return (
        <BaseUrlContext.Provider value={`${API_ORIGIN}/movies/`}>
            <EditorProvider>
                <MoviesContent />
            </EditorProvider>
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
          <ProgressBar url={"stats"} done="watched_movies" todo="unwatched_movies" total="total_movies" />
        } menu={
          <>
            <GenresTree url={"genres"} onClick={toggleGenre} selected={genre} />
            <br />
            <GenresTree url={"organization"} onClick={toggleOrganization} selected={organization} />
          </>
        } scrubber={
          <AlphabetScrabber letters={letters} />
        }>
          <div className="mt-4 px-2">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-4">
              <button className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700" onClick={() => { openEditor("New Movie", null, {}) }}>
                New Movie
              </button>
              <label className="inline-flex select-none items-center gap-2 text-sm font-medium text-neutral-200">
                <input className="size-4 rounded border-neutral-500 bg-neutral-800 text-emerald-600 focus:ring-emerald-500"
                       type="checkbox" id="hide-completed-series" checked={completed}
                       onChange={handleHideCompleted} />
                  Hide Watched
              </label>
            </div>
          </div>
          <div className="hidden lg:block mt-4">
            <Timeline selected={year} onSelect={(newYear) => filter({ type: 'SET_YEAR', value: newYear })} />
          </div>
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