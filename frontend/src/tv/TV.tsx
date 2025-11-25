import PageShell from '../PageShell';
import ProgressBar from '../utils/ProgressBar';
import AlphabetScrabber from '../utils/AlphabetScrabber';
import BaseUrlContext, { API_ORIGIN } from '../utils/BaseUrlContext';
import TVRow from './TVRow';
import Controls from './Controls';
import { EditorProvider } from './Editor';
import useStandardQuery from '../utils/useStandardQuery';
import useAlphabetizedData from './hooks/useAlphabetizedData';
import useFilters from './hooks/useFilters';
import useEditor from '../utils/editor/useEditor';
import type { Show } from '../types/tv';
import DynamicHeader from '../utils/DynamicHeader';
import GenresTree from '../utils/GenresTree';
import { CacheBusterProvider } from '../utils/useCacheBuster';

export default function TV() {
    return (
        <BaseUrlContext.Provider value={`${API_ORIGIN}/tv/`}>
            <CacheBusterProvider>
                <EditorProvider>
                    <TVContent />
                </EditorProvider>
            </CacheBusterProvider>
        </BaseUrlContext.Provider>
    )
}

function TVContent() {
    const query = useStandardQuery<Show[]>('shows');
    const {
      filter, filteredData, filterTitle, filterText, completed, handleHideCompleted, genre, toggleGenre
    } = useFilters(query.data);
    const { data, letters } = useAlphabetizedData(filteredData);
    const { openEditor } = useEditor();

    return (
        <PageShell header={
          <DynamicHeader title={filterTitle} dynamic={filterText} onCancel={() => filter({ type: 'RESET_FILTERS' })} />
        } progress={
          <ProgressBar />
        } menu={
          <GenresTree url="genres" onClick={toggleGenre} selected={genre} />
        } scrubber={
          <AlphabetScrabber letters={letters} />
        } controls={
          <Controls onNewShow={() => openEditor("New Show", null, {})} completed={completed}
                    toggleCompleted={handleHideCompleted} />
        }>
          {data ? (
            <table className="table-auto w-full text-sm text-left">
              <thead className="hidden bg-neutral-800 text-neutral-400 uppercase tracking-wider text-xs font-semibold md:table-header-group">
                <TVRow headerOnly={true} />
              </thead>
              <tbody className="md:divide-y md:divide-neutral-600">
                {data.map(({ show, anchorId }) => (
                  <TVRow key={show.show_id} show={show} onFilter={filter} anchorId={anchorId} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-neutral-400">Loading...</div>
          )}
        </PageShell>
    )
}