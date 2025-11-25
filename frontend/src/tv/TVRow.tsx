import useEditor from "../utils/editor/useEditor";
import type { TVRow, ShowSeasonBreakdown } from "../types/tv";
import { useEffect, useState } from "react";
import Button from "../utils/elements/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBaseUrl, API_ORIGIN } from "../utils/BaseUrlContext";
import { SHOW_PLACEHOLDER } from "../utils/placeholders";
import ListOfLinks from "../utils/ListOfLinks";
import useCacheBuster from "../utils/useCacheBuster";

const EMPTY_BREAKDOWN: ShowSeasonBreakdown[] = [];

export default function TVRow(props: TVRow) {
    const [ expanded, setExpanded ] = useState(false);
    const { openEditor } = useEditor();
    const baseUrl = useBaseUrl();
    const queryClient = useQueryClient();
    const [thumbnailVersion] = useCacheBuster();
    const [breakdown, setBreakdown] = useState(!props.headerOnly && props.show.breakdown || EMPTY_BREAKDOWN);

    const showBreakdown = !props.headerOnly && props.show.breakdown || EMPTY_BREAKDOWN;

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
            const url = `${baseUrl}/shows/${!props.headerOnly && props.show.show_id}/episodes`;
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
            queryClient.invalidateQueries({queryKey: ['shows']});
        },
    });

    if (props.headerOnly) {
        return (
            <tr>
              <th className="w-px"></th>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Show</th>
              <th className="px-6 py-3">Bookmark</th>
              <th className="px-6 py-3">Seasons</th>
              <th className="px-6 py-3">Ended</th>
              <th className="px-6 py-3">Series</th>
              <th className="px-6 py-3">Genres</th>
              <th className="px-6 py-3">Edit</th>
            </tr>
        );
    }

    const { show, onFilter, anchorId } = props;

    return (
        <>
          {anchorId && (
            <tr id={anchorId} aria-hidden="true" className="scroll-mt-18">
              <td colSpan={9} className="p-0" />
            </tr>
          )}
          <tr  className="hidden bg-neutral-700 transition-colors hover:bg-neutral-600 md:table-row">
            <td onClick={() => setExpanded(!expanded)} className="w-px whitespace-nowrap px-2 py-2 text-2xl text-neutral-400 select-none cursor-pointer">
              {expanded ? '▾' : '▸'}
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{show.show_id}</td>
            <td className={"whitespace-nowrap px-6 py-2 text-neutral-100"}>{show.bookmark == 'Finished' ? '✅' : '🟥'}{show.show}</td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{show.bookmark}</td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{show.seasons}</td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{show.ended ? 'ENDED' : ''}</td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
              <ListOfLinks items={show.series_name ? [show.series_name] : []} onClick={
                (series) => onFilter({ type: 'SET_SERIES', value: series })
              } />
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
              <ListOfLinks items={show.genres} onClick={
                (genre) => onFilter({ type: 'SET_GENRE', value: genre })
              } />
            </td>
            <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
              <Button onClick={() => openEditor(show.show, show.show_id, show)} text="Edit" />
            </td>
          </tr>
          <tr className="md:hidden" onClick={() => setExpanded(!expanded)}>
            <td colSpan={9} className="p-0">
              <article className="m-2 flex items-start gap-2 rounded-lg border border-neutral-600 bg-neutral-800 p-3 shadow-sm">
                <span className="shrink-0 select-none text-2xl text-neutral-400">
                  {expanded ? '▾' : '▸'}
                </span>
                <div className="w-20 h-30 shrink-0 overflow-hidden rounded bg-neutral-700">
                  <img src={`${API_ORIGIN}/thumbnails/tv/${show.show_id}.webp?v=${thumbnailVersion}`} alt={`${show.show} cover art`}
                       className="h-full w-full object-contain" loading="lazy"
                       onError={(e) => { e.currentTarget.src = SHOW_PLACEHOLDER; }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold text-neutral-100">
                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">#{show.show_id}</span>
                        <span className="flex items-center gap-1">
                          {show.bookmark == 'Finished' ? '✅' : '🟥'}
                          <span>{show.show}</span>
                        </span>
                      </h3>
                    </div>
                    <Button onClick={(e) => { e.stopPropagation(); openEditor(show.show, show.show_id, show)}} text="Edit" />
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex gap-1">
                      <dt className="text-neutral-400">Seasons:</dt>
                      <dd className="text-neutral-100">{show.seasons}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="text-neutral-400">Ended:</dt>
                      <dd className="text-neutral-100">{show.ended ? 'ENDED' : ''}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="text-neutral-400">Series:</dt>
                      <dd className="text-neutral-100" onClick={(e) => e.stopPropagation()}>
                        <ListOfLinks items={show.series_name ? [show.series_name] : []} onClick={
                          (series) => onFilter({ type: 'SET_SERIES', value: series })
                        } />
                      </dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="text-neutral-400">Bookmark:</dt>
                      <dd className="text-neutral-100">{show.bookmark}</dd>
                    </div>
                    <div className="col-span-2 flex gap-1">
                      <dt className="text-neutral-400">Genres:</dt>
                      <dd className="text-neutral-100" onClick={(e) => e.stopPropagation()}>
                        <ListOfLinks items={show.genres} onClick={
                          (genre) => onFilter({ type: 'SET_GENRE', value: genre })
                        } />
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            </td>
          </tr>

          <tr>
            <td colSpan={9} className="p-0">
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