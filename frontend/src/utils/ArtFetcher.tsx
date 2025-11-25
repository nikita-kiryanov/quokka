import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { API_ORIGIN, useBaseUrl } from './BaseUrlContext';
import Thumbnail from './elements/Thumbnail';
import DebouncedInput from './elements/DebouncedInput';

export default function ArtFetcher({ subject, current, onSelect, placeholder }: ArtFetcherProps) {
    const baseUrl = useBaseUrl();
    const [index, setIndex] = useState(0);
    const [searchText, setSearchText] = useState(subject);
    const grids = useQuery({
        queryKey: ['grids', searchText],
        queryFn: async () => {
            const response = await fetch(`${baseUrl}art/${encodeURIComponent(searchText ? searchText : subject)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch art: ${response.status}`);
            }
            return response.json();
        },
        placeholderData: keepPreviousData
    });

    useEffect(() => {
        setIndex(0);
    }, [searchText]);

    const selectNext = () => {
        const newIndex = Math.min(grids.data.length, index + 1);
        setIndex(newIndex);
        onSelect(grids.data[newIndex - 1].url);
    }

    const selectPrev = () => {
        const newIndex = Math.max(index - 1, 0);
        setIndex(newIndex);
        if (newIndex == 0) {
            onSelect(null);
        } else {
            onSelect(grids.data[newIndex - 1].url);
        }
    }

    return (
        <>
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => selectPrev()} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-600 hover:border-gray-500 hover:text-gray-900">
              &#8592;
            </button>
            <div>
              {index == 0 ? (
                <div className="flex h-64 aspect-2/3 items-center justify-center bg-background">
                  <Thumbnail src={`${API_ORIGIN}/${current}`} alt={`Art for ${subject}`} key={index} fallback={placeholder} />
                </div>
              ) : (
                <div className="flex h-64 aspect-2/3 items-center justify-center bg-background">
                  {grids.isFetched && index <= grids.data.length &&
                    <Thumbnail src={grids.data[index - 1].url} alt={`Art for ${searchText}`} key={index} fallback={placeholder} />}
                </div>
              )}
              <div>{index == 0 ? 'Current' : (index + ' / ' + grids.data.length)}</div>
            </div>
            <button onClick={() => selectNext()} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-600 hover:border-gray-500 hover:text-gray-900">
              &#8594;
            </button>
          </div>
          <DebouncedInput placeholder="Name (year)" delay={500} initialValue={subject} onDebouncedChange={setSearchText} key={subject} />
        </>
    );
}
