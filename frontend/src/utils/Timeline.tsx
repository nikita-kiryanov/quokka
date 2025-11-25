
import { useQuery } from "@tanstack/react-query";
import { useBaseUrl } from "./BaseUrlContext";


type TimelineEntry = {
    year: string;
    count: number;
    max_count: number;
};

type TimelineProps = {
    selected: string;
    onSelect: (year: string) => void;
};

/** Horizontally scrollable bar chart of entries per year, doubling as a year filter. */
export default function Timeline({selected, onSelect}: TimelineProps) {
    const path = useBaseUrl('timeline');
    const query = useQuery<TimelineEntry[]>({
        queryKey: [path], queryFn: () => {
            return fetch(path).then(res => res.json());
        },
    });

    if (query.isError) return <p>Error: {query.error.message}</p>;
    if (!query.data) return null;

    return (
        <div dir="rtl" className="w-full overflow-x-auto rounded-xl p-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-300">
          <div dir="ltr" className="relative flex min-w-max gap-3 px-3 before:absolute before:left-3 before:right-3 before:top-10 before:h-px before:bg-neutral-500">
            {query.data?.map((entry: TimelineEntry, index: number) => (
              <a key={index} className="group relative z-10 grid min-w-8 grid-rows-[40px_20px] justify-items-center text-neutral-300 no-underline hover:text-blue-400 focus:text-blue-400">
                <div className="flex w-full items-end justify-center">
                  <div className={`w-7 rounded-t-md group-hover:bg-blue-500 cursor-pointer ${selected == entry.year ? 'bg-blue-500' : 'bg-neutral-500'}`}
                       onClick={(e) => {
                           e.preventDefault();
                           onSelect(String(entry.year));
                       }}
                       style={{ height: `${40 / entry.max_count * entry.count}px` }}></div>
                </div>
                <div className={`text-xs group-hover:text-blue-400 cursor-pointer select-none ${selected == entry.year ? 'text-blue-400' : 'text-neutral-300'}`}>
                  {entry.year}
                </div>
              </a>
            ))}
          </div>
        </div>
    )
}