import { lazy, useCallback, useMemo, useState, type ReactNode } from "react";
import useDataSet from "../utils/editor/useDataSet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBaseUrl } from "../utils/BaseUrlContext";
import { EditorContext } from "../utils/editor/useEditor";
import { BOOK_PLACEHOLDER } from "../utils/placeholders";
import useCacheBuster from "../utils/useCacheBuster";
import Button from "../utils/elements/Button";

const TagInputs = lazy(() => import("../utils/editor/TagInputs"));
const InputLabelDataList = lazy(() => import("../utils/editor/InputLabelDataList"));
const ArtFetcher = lazy(() => import("../utils/ArtFetcher"));
const Checkbox = lazy(() => import("../utils/elements/Checkbox"));
const Input = lazy(() => import("../utils/elements/Input"));
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
            books: {
                read: data.read || false,
                book_name: data.book,
                series_name: data.series || null,
                release_date: data.release_date || null,
                comments: data.comments || null,
            },
            books_to_content_genres: {
                genres: data.genres || [],
            },
            books_to_authors: {
                authors: data.authors || [],
            },
            book_id: data.book_id || null,
            thumbnail: data.thumbnail,
        };

        return payload;
    }

    const mutation = useMutation({
        mutationFn: async (newBook: any): Promise<{success: boolean}> => {
            const url = baseUrl + 'books' + (newBook.book_id ? `/${newBook.book_id}` : '');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadTranslator(newBook)),
            });

            if (!response.ok) {
                throw new Error(`Failed to create book: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['books']});
            setNextVersion();
            closeEditor();
        },
    });

    function onChange(data: Object) {
        setFormState((prevState: Object) => ({ ...prevState, ...data }));
    }

    const openEditor = useCallback((title: string, id: number | null, content: any) => {
        setFormState({...content, book_id: id});
        setTitle(title);
    }, []);

    const closeEditor = useCallback(() => {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-4">
              <div className="sm:col-start-1 sm:row-start-1 lg:col-start-1 lg:row-start-1 xl:col-start-1 xl:row-start-1">
                <InputLabelDataList label="Name" name="book" id="i-book" value={formState.book || ''}
                                    onChange={(e: InputChange) => { onChange({ book: e.target.value }) }} />
              </div>
              <div className="sm:col-start-1 sm:row-start-2 lg:col-start-1 lg:row-start-2 xl:col-start-1 xl:row-start-2">
                <InputLabelDataList label="Series" name="series" id="i-series"
                                    value={formState.series || ''} suggestions={series.data}
                                    onChange={(e: InputChange) => { onChange({ series: e.target.value }) }} />
              </div>
              <div className="sm:col-start-1 sm:row-start-3 lg:col-start-2 lg:row-start-1 xl:col-start-2 xl:row-start-1">
                <Input type="date" name="release-date" id="i-release-date" label="Release Date"
                       value={formState.release_date || ''}
                       onChange={(e: InputChange) => { onChange({ release_date: e.target.value }) }} />
              </div>
              <div className="sm:col-start-1 sm:row-start-4 lg:col-start-2 lg:row-start-2 xl:col-start-2 xl:row-start-2">
                <Checkbox name="read" id="i-read" label="Read" checked={formState.read || false}
                          onChange={(e: InputChange) => onChange({ read: e.target.checked })} />
              </div>
              <div className="sm:col-start-1 sm:row-start-5 lg:col-start-3 lg:row-start-1 xl:col-start-3 xl:row-start-1">
                <label className="block text-sm font-medium text-neutral-300 mb-1">Genres</label>
                <TagInputs search="genre" items={formState.genres || []}
                           onChange={(newData: string[]) => { onChange({ genres: newData}) }} />
              </div>
              <div className="sm:col-start-1 sm:row-start-6 lg:col-start-3 lg:row-start-2 xl:col-start-4 xl:row-start-1 xl:row-span-3">
                <label className="block text-sm font-medium text-neutral-300 mb-1">Authors</label>
                <TagInputs search="authors" items={formState.authors || []}
                           onChange={(newData: string[]) => { onChange({ authors: newData }) }} />
              </div>
              <div className="sm:col-start-2 sm:row-start-1 sm:row-span-6 lg:col-start-2 lg:row-start-3 lg:row-span-1 xl:col-start-3 xl:row-start-2">
                <ArtFetcher subject={formState.book} placeholder={BOOK_PLACEHOLDER}
                            onSelect={(url: string | null) => { onChange({ thumbnail: url }) }}
                            current={`thumbnails/${formState.book_id}.webp`} key={formState.book_id} />
                <FileUploadInput label="OR" onChange={(base64) => onChange({ thumbnail: base64 })} />
              </div>
              <div className="col-span-full xl:col-start-1 xl:row-start-5 xl:col-span-6 flex gap-2 justify-center">
                <Button onClick={(e) => { mutation.mutate(formState) }} text="Save" />
                <Button onClick={(e) => closeEditor()} text="Cancel" />
              </div>
            </div>
          </div>
        </div>
      </EditorContext.Provider>
    );
}
