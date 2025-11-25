import { useQuery } from "@tanstack/react-query";
import { useBaseUrl } from "./BaseUrlContext";

/** Fetches and displays a short info blurb for a given name. Renders nothing if no param is provided or no info is found. */
export default function InfoBlock({url, param}: InfoBlockProps) {
    const path = useBaseUrl(url);
    const query = useQuery({
        queryKey: [path, param], queryFn: () => {
            if (param) {
                path.searchParams.append('name', param);
            }
            return fetch(path).then(res => res.json());
        }
    });

    if (!param) return null;

    const info = query.data?.info || '';

    if (!info) return null;

    return (
        <div className="p-4 border-b border-gray-300 dark:border-gray-700 text-center w-1/2 mx-auto">
          <p>{info}</p>
        </div>
    );
}
