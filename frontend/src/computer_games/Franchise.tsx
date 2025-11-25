import Series from "./Series";
import type { FranchiseProps } from "../types/computer-games";

export default function Franchise({ name, entries, onFilter }: FranchiseProps) {
    const seriesNames = Object.keys(entries || {});
    // Standalone series are grouped under a franchise key equal to their own
    // series name (see backend/routes/computer-games.js), so there's no real
    // franchise to head the section with.
    const isNamedFranchise = !(seriesNames.length === 1 && seriesNames[0] === name);

    return (
        <>
            {isNamedFranchise && <h1 className="text-4xl">{name}</h1>}
            {seriesNames.map((series: string, index: number) => {
                return (
                    <Series name={series} isUnderFranchise={isNamedFranchise} entry={entries[series]}
                            onFilter={onFilter} key={index} />
                );
              })
          }
        </>
    )
}