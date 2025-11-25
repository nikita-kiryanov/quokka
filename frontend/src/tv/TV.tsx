import PageShell from '../PageShell';
import ProgressBar from '../utils/ProgressBar';
import AlphabetScrabber from '../utils/AlphabetScrabber';
import BaseUrlContext, { API_ORIGIN } from '../utils/BaseUrlContext';
import TVRow from './TVRow';
import { EditorProvider } from './Editor';
import useStandardQuery from '../utils/useStandardQuery';
import useAlphabetizedData from './hooks/useAlphabetizedData';
import useFilters from './hooks/useFilters';
import useEditor from '../utils/editor/useEditor';
import type { Show } from '../types/tv';

export default function TV() {
    return (
        <BaseUrlContext.Provider value={`${API_ORIGIN}/tv/`}>
            <EditorProvider>
                <TVContent />
            </EditorProvider>
        </BaseUrlContext.Provider>
    )
}

function TVContent() {
    const query = useStandardQuery<Show[]>('tv');
    const { filteredData, completed, handleHideCompleted } = useFilters(query.data);
    const { data, letters } = useAlphabetizedData(filteredData);
    const { openEditor } = useEditor();

    return (
        <PageShell progress={
          <ProgressBar url={"stats"} done="watched_shows" todo="unwatched_shows" total="total_shows" />
        } scrubber={
          <AlphabetScrabber letters={letters} />
        }>
          <div className="mt-4 px-2">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-4">
              <button className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700" onClick={() => { openEditor("New Show", null, {}) }}>
                New Show
              </button>
              <label className="inline-flex select-none items-center gap-2 text-sm font-medium text-neutral-200">
                <input className="size-4 rounded border-neutral-500 bg-neutral-800 text-emerald-600 focus:ring-emerald-500"
                       type="checkbox" id="hide-completed-series" checked={completed}
                       onChange={handleHideCompleted} />
                  Hide Watched
              </label>
            </div>
          </div>
          {data ? (
            <table className="table-auto w-full text-sm text-left">
              <thead className="hidden bg-neutral-800 text-neutral-400 uppercase tracking-wider text-xs font-semibold md:table-header-group">
                <TVRow headerOnly={true} />
              </thead>
              <tbody className="md:divide-y md:divide-neutral-600">
                {data.map(({ show, anchorId }) => (
                  <TVRow key={show.show_id} show={show} anchorId={anchorId} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-neutral-400">Loading...</div>
          )}
        </PageShell>
    )
}