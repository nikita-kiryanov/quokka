import DynamicHeader from '../utils/DynamicHeader';
import Brand from './Brand';
import PageShell from '../PageShell';
import BaseUrlContext, { API_ORIGIN } from '../utils/BaseUrlContext';
import AlphabetScrabber from '../utils/AlphabetScrabber';
import GenresTree from '../utils/GenresTree';
import useStandardQuery from '../utils/useStandardQuery';
import type { SauceData } from '../types/hot-sauces';
import { EditorProvider, useEditor } from './Editor';
import useFilters from './useFilters';
import useAlphabetizedData from './useAlphabetizedData';

export default function HotSauces() {
    return (
        <BaseUrlContext.Provider value={`${API_ORIGIN}/hot-sauces/`}>
            <EditorProvider>
                <HotSaucesContent />
            </EditorProvider>
        </BaseUrlContext.Provider>
    )
}

function HotSaucesContent() {
    const query = useStandardQuery<SauceData>('sauces');
    const {pepper, filter, filterTitle, filterText, filteredData, togglePepper} = useFilters(query.data);
    const { data, letters } = useAlphabetizedData(filteredData);
    const { openEditor } = useEditor();

    const onCancel = () => filter({ type: 'RESET_FILTERS' });

    return (
        <PageShell header={
            <DynamicHeader title={filterTitle} dynamic={filterText} onCancel={onCancel} />
        } menu={
            <GenresTree url="peppers" onClick={togglePepper} selected={pepper} />
        } scrubber={
            <AlphabetScrabber letters={letters} />
        }>
          <div className="px-2">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-4">
              <button className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700" onClick={() => { openEditor("New Sauce", null, {}) }}>New Sauce</button>
            </div>
          </div>
          {Object.keys(data || {}).map((brand: string, index: number) => (
              <Brand name={brand} sauces={data![brand].sauces} onPepper={togglePepper} key={index} />
          ))}
        </PageShell>
    )
}