import Series from "./Series";
import type { FranchiseProps } from "../types/computer-games";

export default function Franchise({ name, entry, onFilter }: FranchiseProps) {
    const seriesNames = Object.keys(entry.series || {});
    // Standalone series are grouped under a franchise key equal to their own
    // series name (see backend/routes/computer-games.js), so the h2 series
    // sub-headers below are only needed when there's more than one series.
    const isNamedFranchise = !(seriesNames.length === 1 && seriesNames[0] === name);

    return (
        <>
            <h1 className="text-4xl scroll-mt-18" id={entry.anchorId}>{name}</h1>
            {seriesNames.map((series: string, index: number) => {
                return (
                    <Series name={series} isUnderFranchise={isNamedFranchise} entry={entry.series[series]}
                            onFilter={onFilter} key={index} />
                );
              })
          }
        </>
    )
}