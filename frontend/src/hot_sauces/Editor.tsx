import { lazy, useCallback, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBaseUrl } from "../utils/BaseUrlContext";
import useDataSet from "../utils/editor/useDataSet";
import { EditorContext } from "../utils/editor/useEditor";
import Button from "../utils/elements/Button";
import { SHOW_PLACEHOLDER } from "../utils/placeholders";

const TagInputs = lazy(() => import("../utils/editor/TagInputs"));
const InputLabelDataList = lazy(() => import("../utils/editor/InputLabelDataList"));
const ArtFetcher = lazy(() => import("../utils/ArtFetcher"));
const FileUploadInput = lazy(() => import("../utils/elements/FileUploadInput"));

type InputChange = React.ChangeEvent<HTMLInputElement>;
type TextAreaChange = React.ChangeEvent<HTMLTextAreaElement>;

export function EditorProvider({ children }: { children: ReactNode }) {
    const baseUrl = useBaseUrl();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState<string>('');
    const [formState, setFormState] = useState<any>(null);

    const brand = useDataSet('dataset/brand', formState != null);

    const payloadTranslator = (data: any) => {
        const payload: any = {
            sauces: {
                comments: data.comments || null,
                sauce_name: data.sauce,
                brand_name: data.brand || null,
            },
            sauces_to_peppers: {
                peppers: data.peppers || [],
            },
            sauce_id: data.sauce_id || null,
            thumbnail: data.thumbnail,
        };

        return payload;
    }

    const mutation = useMutation({
        mutationFn: async (newSauce: any): Promise<{success: boolean}> => {
            const url = `${baseUrl}/hot-sauces` + (newSauce.sauce_id ? `/${newSauce.sauce_id}` : '');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadTranslator(newSauce)),
            });

            if (!response.ok) {
                throw new Error(`Failed to create game: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['sauces']});
            closeEditor();
        },
    });

    function onChange(data: Object) {
        setFormState((prevState: Object) => ({ ...prevState, ...data }));
    }

    const openEditor = useCallback(function openEditor(title: string, id: number | null, content: any) {
        setFormState({...content, sauce_id: id});
        setTitle(title);
    }, []);

    const closeEditor = useCallback(function closeEditor() {
        setFormState(null);
        setTitle('');
    }, []);

    const contextValue = useMemo(() => ({ openEditor, closeEditor }), [openEditor, closeEditor]);

    if (!formState) {
        return (
            <EditorContext.Provider value={contextValue}>
                {children}
            </EditorContext.Provider>
        );
    }

    return (
      <EditorContext.Provider value={contextValue}>
        {children}
        <div className="fixed inset-0 flex items-center bg-neutral-900/50 backdrop-blur z-30" onClick={(e) => (e.target === e.currentTarget) && closeEditor()}>
          <div className="rounded-xl border border-blue-500 bg-neutral-700 text-center w-full overflow-hidden max-h-[90vh]">
            <div className="overflow-y-auto max-h-[90vh] p-6 scheme-dark">
              <h2 className="text-2xl mb-4">{title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
                <div className="lg:col-start-1 lg:row-start-1">
                  <InputLabelDataList label="Name" value={formState.sauce || ''}
                                      onChange={(e: InputChange) => { onChange({ sauce: e.target.value }) }} />
                </div>
                <div className="lg:col-start-2 lg:row-start-1">
                  <InputLabelDataList label="Brand" value={formState.brand || ''} suggestions={brand.data}
                                      onChange={(e: InputChange) => { onChange({ brand: e.target.value }) }} />
                </div>
                <div className="lg:col-span-1 lg:col-start-3 lg:row-start-1">
                  <TagInputs search="pepper" items={formState.peppers || []} label="Peppers"
                             onChange={(peppers: string[]) => { onChange({ peppers }) }} />
                </div>
                <div className="sm:col-start-2 lg:col-start-1 lg:row-start-2">
                  <label htmlFor="i-comments" className="block text-sm font-medium text-neutral-300 mb-1">
                    Comments
                  </label>
                  <textarea className="w-full min-h-20 flex-1 rounded-md border border-blue-500 bg-neutral-700/50 p-2 text-left text-sm"
                          name="comments" id="i-comments" value={formState.comments || ''}
                          onChange={(e: TextAreaChange) => { onChange({ comments: e.target.value }) }} />
                </div>
                <div className="sm:col-start-2 lg:col-start-3 lg:row-start-2">
                  <ArtFetcher subject={formState.sauce} placeholder={SHOW_PLACEHOLDER}
                              onSelect={(url: string | null) => { onChange({ thumbnail: url }) }}
                              current={`thumbnails/sauces/${formState.sauce_id}.webp`} key={formState.sauce_id} />
                  <FileUploadInput label="OR" onChange={(thumbnail) => onChange({ thumbnail })} />
                </div>
                <div className="col-span-full flex gap-2 justify-center">
                  <Button onClick={(e) => { mutation.mutate(formState) }} text="Save" />
                  <Button onClick={(e) => closeEditor()} text="Cancel" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </EditorContext.Provider>
    );
}
