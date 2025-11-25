import PageShell from '../PageShell';
import DynamicHeader from '../utils/DynamicHeader';
import ProgressBar from '../utils/ProgressBar';
import GenresTree from '../utils/GenresTree';
import AlphabetScrabber from '../utils/AlphabetScrabber';
import BaseUrlContext, { API_ORIGIN } from '../utils/BaseUrlContext';
import Series from './Series';
import Controls from './Controls';
import useEditor from '../utils/editor/useEditor';
import type { BooksData } from '../types/books';
import useStandardQuery from '../utils/useStandardQuery';
import useAlphabetizedData from './hooks/useAlphabetizedData';
import useFilters from './hooks/useFilters';
import Timeline from '../utils/Timeline';
import { EditorProvider } from './Editor';
import { CacheBusterProvider } from '../utils/useCacheBuster';

export default function Books() {
    return (
        <BaseUrlContext.Provider value={`${API_ORIGIN}/books`}>
          <CacheBusterProvider>
            <EditorProvider>
              <BooksContent />
            </EditorProvider>
          </CacheBusterProvider>
        </BaseUrlContext.Provider>
    )
}

function BooksContent() {
    const query = useStandardQuery<BooksData>('books');
    const {
        filter, filterTitle, filterText, filteredData, genre, toggleGenre, completed, year,
        handleHideCompleted
    } = useFilters(query.data);
    const { data, letters } = useAlphabetizedData(filteredData);
    const { openEditor } = useEditor();

    return (
        <PageShell header={
          <DynamicHeader title={filterTitle} dynamic={filterText} onCancel={() => filter({ type: 'RESET_FILTERS' })} />
        } progress={
          <ProgressBar />
        } menu={
          <GenresTree url={"genres"} onClick={toggleGenre} selected={genre} />
        } scrubber={
          <AlphabetScrabber letters={letters} />
        } timeline={
          <Timeline selected={year} onSelect={(newYear) => filter({ type: 'SET_YEAR', value: newYear })} />
        } controls={
          <Controls onNewBook={() => openEditor("New Book", null, {})} completed={completed}
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