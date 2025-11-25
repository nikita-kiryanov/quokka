import { lazy, useCallback, useMemo, useState, type ReactNode } from "react";
import useDataSet from "../utils/editor/useDataSet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBaseUrl } from "../utils/BaseUrlContext";
import { EditorContext } from "../utils/editor/useEditor";
import { SHOW_PLACEHOLDER } from "../utils/placeholders";
import useCacheBuster from "../utils/useCacheBuster";
import Button from "../utils/elements/Button";

const TagInputs = lazy(() => import("../utils/editor/TagInputs"));
const InputLabelDataList = lazy(() => import("../utils/editor/InputLabelDataList"));
const ArtFetcher = lazy(() => import("../utils/ArtFetcher"));
const Checkbox = lazy(() => import("../utils/elements/Checkbox"));
const FileUploadInput = lazy(() => import("../utils/elements/FileUploadInput"));

type InputChange = React.ChangeEvent<HTMLInputElement>;

export function EditorProvider({ children }: { children: ReactNode }) {
    const baseUrl = useBaseUrl();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState<string>('');
    const [formState, setFormState] = useState<any>(null);
    const [_, setNextVersion] = useCacheBuster();
    const series = useDataSet('dataset/series', formState != null);

    const payloadTranslator = (data: any) => {
        const payload: any = {
            shows: {
                show: data.show,
                series_name: data.series_name || null,
                ended: data.ended || false,
            },
            shows_to_genres: {
                genres: data.genres || [],
            },
            episodes: data.breakdown || [],
            show_id: data.show_id || null,
            thumbnail: data.thumbnail,
        };

        return payload;
    }

    const mutation = useMutation({
        mutationFn: async (newShow: any): Promise<{success: boolean}> => {
            const url = baseUrl + 'shows/' + (newShow.show_id ? `${newShow.show_id}` : '');
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payloadTranslator(newShow)),
            });

            if (!response.ok) {
                throw new Error(`Failed to create game: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shows'] });
            setNextVersion();
            closeEditor();
        },
    });

    function onChange(data: Object) {
        setFormState((prevState: Object) => ({ ...prevState, ...data }));
    }

    const openEditor = useCallback(function openEditor(title: string, id: number | null, content: any) {
        setFormState({...content, show_id: id});
        setTitle(title);
    }, []);

    const closeEditor = useCallback(function closeEditor() {
        setFormState(null);
        setTitle('');
    }, []);

    const contextValue = useMemo(() => ({ openEditor, closeEditor }), [openEditor, closeEditor]);

    if (!series.isFetched || !formState) {
        return (
            <EditorContext.Provider value={contextValue}>
              {children}
            </EditorContext.Provider>
        );
    }

    return (
      <EditorContext.Provider value={contextValue}>
        {children}
        <div className="fixed inset-0 flex items-center bg-neutral-900/50 backdrop-blur z-10" onClick={(e) => (e.target === e.currentTarget) && closeEditor()}>
          <div className="rounded-xl border border-blue-500 bg-neutral-700 p-6 text-center w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl mb-4">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
              <div className="lg:col-start-1 lg:row-start-1">
                <InputLabelDataList label="Name" name="Show" id="i-show" value={formState.show || ''}
                                    onChange={(e: InputChange) => { onChange({ show: e.target.value }) }} />
              </div>
              <div className="lg:col-start-2 lg:row-start-1">
                <InputLabelDataList label="Series" name="Series" id="i-series"
                                    value={formState.series_name || ''} suggestions={series.data}
                                    onChange={(e: InputChange) => { onChange({ series_name: e.target.value }) }} />
              </div>
              <div className="lg:col-start-3 lg:row-start-1 lg:row-span-2">
                <label className="block text-sm font-medium text-neutral-300 mb-1">Genres</label>
                <TagInputs search="genre" items={formState.genres || []}
                           onChange={(newData: string[]) => { onChange({ genres: newData }) }} />
              </div>
              <div className="lg:col-start-1 lg:row-start-2">
                <Checkbox name="ended" id="i-ended" label="Ended" checked={formState.ended || false}
                          onChange={(e: InputChange) => onChange({ ended: e.target.checked })} />
              </div>
              <div className="lg:col-start-2 lg:row-start-2">
                <ArtFetcher subject={formState.show} placeholder={SHOW_PLACEHOLDER}
                            onSelect={(url: string | null) => { onChange({ thumbnail: url }) }}
                            current={`thumbnails/tv/${formState.show_id}.webp`} key={formState.show_id} />
                <FileUploadInput label="OR" onChange={(base64) => onChange({ thumbnail: base64 })} />
              </div>
              <div className="col-span-full">
                {(formState.breakdown || []).map((season: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    Season {season.season}:
                    <Button onClick={() => {
                        const newBreakdown = [...(formState.breakdown || [])];
                        if (newBreakdown[index].episodes.length > 0 && confirm('Remove the last episode?')) {
                            newBreakdown[index].episodes.pop();
                            onChange({ breakdown: newBreakdown });
                        }
                    }} text="-" />
                    <Button onClick={() => {
                        const newBreakdown = [...(formState.breakdown || [])];
                        newBreakdown[index].episodes.push({ episode: newBreakdown[index].episodes.length + 1 });
                        onChange({ breakdown: newBreakdown });
                    }} text="+" />
                    <ul className="flex flex-wrap gap-2">
                      {season.episodes.map((episode: any, epIndex: number) => (
                        <li key={epIndex}>{epIndex + 1}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="flex items-start gap-2 mb-2">
                  <Button onClick={() => {
                      const newBreakdown = [...(formState.breakdown || [])];
                        if (newBreakdown.length > 0 && confirm('Remove the last season?')) {
                          newBreakdown.pop();
                          onChange({ breakdown: newBreakdown });
                      }
                  }} text="-" />
                  <Button onClick={() => {
                      const newBreakdown = [...(formState.breakdown || [])];
                      newBreakdown.push({ season: newBreakdown.length + 1, episodes: [] });
                      onChange({ breakdown: newBreakdown });
                  }} text="+" />
                </div>
              </div>
              <div className="col-span-full flex gap-2 justify-center">
                <Button onClick={(e) => { mutation.mutate(formState) }} text="Save" />
                <Button onClick={(e) => closeEditor()} text="Cancel" />
              </div>
            </div>
          </div>
        </div>
      </EditorContext.Provider>
    );
}
