import DynamicHeader from '../utils/DynamicHeader';
import Brand from './Brand';
import Controls from './Controls';
import PageShell from '../PageShell';
import BaseUrlContext, { API_ORIGIN } from '../utils/BaseUrlContext';
import AlphabetScrabber from '../utils/AlphabetScrabber';
import GenresTree from '../utils/GenresTree';
import useStandardQuery from '../utils/useStandardQuery';
import type { SauceData } from '../types/hot-sauces';
import { EditorProvider } from './Editor';
import useFilters from './useFilters';
import useAlphabetizedData from './useAlphabetizedData';
import useEditor from '../utils/editor/useEditor';
import { CacheBusterProvider } from '../utils/useCacheBuster';

export default function HotSauces() {
    return (
        <BaseUrlContext.Provider value={`${API_ORIGIN}/hot-sauces`}>
            <CacheBusterProvider>
                <EditorProvider>
                    <HotSaucesContent />
                </EditorProvider>
            </CacheBusterProvider>
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
        } controls={
            <Controls onNewSauce={() => openEditor("New Sauce", null, {})} />
        }>
          {Object.keys(data || {}).map((brand: string, index: number) => (
              <Brand name={brand} sauces={data![brand].sauces} onPepper={togglePepper} key={index} />
          ))}
        </PageShell>
    )
}