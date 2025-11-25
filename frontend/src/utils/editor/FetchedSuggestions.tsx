import { useQuery } from '@tanstack/react-query';
import { useBaseUrl } from '../BaseUrlContext';

export default function FetchedSuggestions({ url, input, onClick }: FetchedSuggestions) {
    const searchUrl = useBaseUrl('search/' + url);
    const query = useQuery({
        queryKey: ['search', searchUrl, input], queryFn: () => {
            searchUrl.searchParams.append('input', input);
            return fetch(searchUrl).then(res => res.json());
        },
        enabled: input.length > 2
    });

    if (query.isError)
        return <p>Error: {query.error.message}</p>;
    if (!query.isFetched)
        return null;
    if (query.data.length === 0)
        return null;

    return (
        <div className="bg-neutral-700 text-neutral-100 rounded-md p-2 border-2 border-white">
            {query.data.map((item: any, index: number) => (
                <div  className="cursor-pointer hover:bg-neutral-600 rounded-md px-2 py-1"
                     key={index} onClick={() => onClick(item.suggestion)}>
                    {item.suggestion}
                </div>
            ))}
        </div>
    );
}