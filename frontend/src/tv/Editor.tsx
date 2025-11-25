import { useCallback, useMemo, useState, type ReactNode } from "react";
import useDataSet from "../utils/editor/useDataSet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBaseUrl } from "../utils/BaseUrlContext";
import InputLabelDataList from "../utils/editor/InputLabelDataList";
import { Checkbox } from "../utils/elements/Checkbox";
import Button from "../utils/elements/Button";
import { EditorContext } from "../utils/editor/useEditor";

type InputChange = React.ChangeEvent<HTMLInputElement>;

export function EditorProvider({ children }: { children: ReactNode }) {
    const baseUrl = useBaseUrl();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState<string>('');
    const [formState, setFormState] = useState<any>(null);
    const series = useDataSet('dataset/series', formState != null);

    const payloadTranslator = (data: any) => {
        const payload: any = {
            shows: {
                show: data.show,
                series_name: data.series || null,
                ended: data.ended || false,
            },
            episodes: data.breakdown || [],
            show_id: data.show_id || null
        };

        return payload;
    }

    const mutation = useMutation({
        mutationFn: async (newShow: any): Promise<{success: boolean}> => {
            const url = baseUrl + (newShow.show_id ? `${newShow.show_id}` : '');
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
            queryClient.invalidateQueries({ queryKey: ['tv'] });
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
              <div>
                <InputLabelDataList label="Name" name="Show" id="i-show" value={formState.show || ''}
                                    onChange={(e: InputChange) => { onChange({ show: e.target.value }) }} />
              </div>
              <div>
                <InputLabelDataList label="Series" name="Series" id="i-series"
                                    value={formState.series || ''} suggestions={series.data}
                                    onChange={(e: InputChange) => { onChange({ series: e.target.value }) }} />
              </div>
              <div>
                <Checkbox name="ended" id="i-ended" label="Ended" checked={formState.ended || false}
                          onChange={(e: InputChange) => onChange({ ended: e.target.checked })} />
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
