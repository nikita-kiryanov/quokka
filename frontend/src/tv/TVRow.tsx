import useEditor from "../utils/editor/useEditor";
import type { TVRow } from "../types/tv";
import { useEffect, useState } from "react";
import Button from "../utils/elements/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBaseUrl } from "../utils/BaseUrlContext";

export default function TVRow(props: TVRow) {
    const [ expanded, setExpanded ] = useState(false);
    const { openEditor } = useEditor();
    const baseUrl = useBaseUrl();
    const queryClient = useQueryClient();
    const [breakdown, setBreakdown] = useState(!props.headerOnly && props.show.breakdown || []);

    const showBreakdown = !props.headerOnly && props.show.breakdown || [];

    useEffect(() => {
        setBreakdown(showBreakdown);
    }, [showBreakdown]);

    const flipCheckbox = (seasonIndex: number, episodeIndex: number) => {
        const updatedBreakdown = [...breakdown];
        updatedBreakdown[seasonIndex].episodes[episodeIndex].watched = !updatedBreakdown[seasonIndex].episodes[episodeIndex].watched;
        setBreakdown(updatedBreakdown);
    }

    const mutation = useMutation({
        mutationFn: async (breakdown: any): Promise<{ success: boolean }> => {
            const url = baseUrl + `${!props.headerOnly && props.show.show_id}/episodes`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(breakdown),
            });

            if (!response.ok) {
                throw new Error(`Failed to create game: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tv']});
        },
    });

    if (props.headerOnly) {
        return (
            <tr>
              <th className="w-px"></th>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Show</th>
              <th className="px-6 py-3">Seasons</th>
              <th className="px-6 py-3">Episodes</th>
              <th className="px-6 py-3">Ended</th>
              <th className="px-6 py-3">Bookmark</th>
              <th className="px-6 py-3">Edit</th>
            </tr>
        );
    }

    const { show, anchorId } = props;

    return (
        <>
          {anchorId && (
            <tr id={anchorId} aria-hidden="true">
              <td colSpan={8} className="p-0" />
            </tr>
          )}
          <tr  className="hidden bg-neutral-700 transition-colors hover:bg-neutral-600 md:table-row">
            <td onClick={() => setExpanded(!expanded)} className="w-px whitespace-nowrap px-2 py-2 text-2xl text-neutral-400 select-none cursor-pointer">
              {expanded ? '▾' : '▸'}
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{show.show_id}</td>
            <td className={"whitespace-nowrap px-6 py-2 text-neutral-100"}>{show.bookmark == 'Finished' ? '✅' : '🟥'}{show.show}</td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{show.seasons}</td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{show.episodes}</td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{show.ended ? 'ENDED' : ''}</td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{show.bookmark}</td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
            <button className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-700" type="button" onClick={(e) => { openEditor(show.show, show.show_id, show)}}>
                  Edit
              </button>
            </td>
          </tr>
          <tr className="md:hidden" onClick={() => setExpanded(!expanded)}>
            <td colSpan={8} className="p-0">
              <article className="m-2 rounded-lg border border-neutral-600 bg-neutral-800 p-3 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold text-neutral-100">
                      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">#{show.show_id}</span>
                      <span className="flex items-center gap-1">
                        {show.bookmark == 'Finished' ? '✅' : '🟥'}
                        <span>{show.show}</span>
                      </span>
                    </h3>
                    {show.series && <p className="truncate text-sm text-neutral-400">{show.series}</p>}
                  </div>
                  <button className="shrink-0 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-700" type="button" onClick={(e) => { e.stopPropagation(); openEditor(show.show, show.show_id, show)}}>
                    Edit
                  </button>
                </div>

                <dl className="grid grid-cols-[92px_1fr] gap-x-2 gap-y-2 text-sm">
                  <dt className="text-neutral-400">Seasons</dt>
                  <dd className="text-neutral-100">{show.seasons}</dd>
                  <dt className="text-neutral-400">Episodes</dt>
                  <dd className="text-neutral-100">{show.episodes}</dd>
                  <dt className="text-neutral-400">Bookmark</dt>
                  <dd className="text-neutral-100">{show.bookmark}</dd>
                </dl>
              </article>
            </td>
          </tr>

          <tr>
            <td colSpan={8} className="p-0">
              <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <article className="m-2 rounded-lg border border-neutral-600 bg-neutral-800 p-3 shadow-sm">
                    {breakdown.map((season, index) => (
                      <div key={index} className="mb-3">
                        <h3 className="mb-1 text-lg font-semibold text-neutral-100">Season {season.season}</h3>
                        <ul className="flex flex-wrap gap-2">
                          {season.episodes.map((episode, epIndex) => (
                            <li key={epIndex}>
                              <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center">
                                <input type="checkbox" checked={episode.watched} onChange={() => flipCheckbox(index, epIndex)}  className="peer sr-only" />
                                <span className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-neutral-700 text-sm font-medium text-neutral-400 peer-checked:bg-emerald-600 peer-checked:text-white">
                                  {episode.episode}
                                </span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Button onClick={(e) => mutation.mutate(breakdown)} text="Save" />
                  </article>
                </div>
              </div>
            </td>
          </tr>
        </>
    );
};