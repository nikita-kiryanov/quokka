import { useQuery } from "@tanstack/react-query";
import { useBaseUrl } from "./BaseUrlContext";

/** Fetches stats from a URL and renders a green/red split bar showing done vs. remaining. */
export default function ProgressBar({url='stats'}: ProgressBarProps) {
    const path = useBaseUrl(url);
    const queryStats = useQuery({
        queryKey: [path], queryFn: async () => {
            return fetch(path).then(res => res.json());
        }
    });

    if (!queryStats.isFetched) return null;

    const donePercent = (queryStats.data['done'] / queryStats.data['total'] * 100);
    const todoPercent = (queryStats.data['todo'] / queryStats.data['total'] * 100);

    return (
        <div className="w-full px-4">
          <div className="text-center md:w-[50%] mx-auto">
            <div style={{ width: donePercent + '%' }} className="rounded-l-3xl inline-block bg-green-800 overflow-hidden">
              {queryStats.data['done']}
            </div>
            <div style={{ width: todoPercent + '%' }} className="rounded-r-3xl inline-block bg-red-800 overflow-hidden">
              {queryStats.data['todo']}
            </div>
          </div>
        </div>
    )
};
