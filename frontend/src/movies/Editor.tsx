import { lazy, useCallback, useMemo, useState, type ReactNode } from "react";
import { EditorContext } from "../utils/editor/useEditor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBaseUrl } from "../utils/BaseUrlContext";
import { MOVIE_PLACEHOLDER } from "../utils/placeholders";
import useDataSet from "../utils/editor/useDataSet";
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
            movies: {
                watched: data.watched || false,
                movie_name: data.movie,
                series_name: data.series_name || null,
                release_date: data.release_date || null,
            },
            movies_to_genres: {
                genres: data.genres || [],
            },
            movies_to_directors: {
                directors: data.directors || [],
            },
            movie_id: data.movie_id || null,
            thumbnail: data.thumbnail,
        };

        return payload;
    }

    const mutation = useMutation({
        mutationFn: async (newMovie: any): Promise<{success: boolean}> => {
            const url = baseUrl + 'movies' + (newMovie.movie_id ? `/${newMovie.movie_id}` : '');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payloadTranslator(newMovie)),
            });

            if (!response.ok) {
                throw new Error(`Failed to create game: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['movies']});
            setNextVersion();
            closeEditor();
        },
    });

    function onChange(data: Object) {
        setFormState((prevState: Object) => ({ ...prevState, ...data }));
    }

    const openEditor = useCallback((title: string, id: number | null, content: any) => {
        setFormState({...content, movie_id: id});
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
                <InputLabelDataList label="Name" name="game" id="i-movie" value={formState.movie || ''}
                                    onChange={(e: InputChange) => { onChange({ game: e.target.value }) }} />
              </div>
              <div className="sm:col-start-1 sm:row-start-2 lg:col-start-1 lg:row-start-2 xl:col-start-1 xl:row-start-2">
                <InputLabelDataList label="Series" name="series" id="i-series"
                                    value={formState.series_name || ''} suggestions={series.data}
                                    onChange={(e: InputChange) => { onChange({ series: e.target.value }) }} />
              </div>
              <div className="sm:col-start-1 sm:row-start-3 lg:col-start-2 lg:row-start-1 xl:col-start-2 xl:row-start-1">
                <Input type="date" name="release-date" id="i-release-date" label="Release Date"
                       value={formState.release_date || ''}
                       onChange={(e: InputChange) => { onChange({ release_date: e.target.value }) }} />
              </div>
              <div className="sm:col-start-1 sm:row-start-4 lg:col-start-2 lg:row-start-2 xl:col-start-2 xl:row-start-2">
                <Checkbox name="watched" id="i-watched" label="Watched" checked={formState.watched || false}
                          onChange={(e: InputChange) => onChange({ watched: e.target.checked })} />
              </div>
              <div className="xl:col-start-3 xl:row-start-1 xl:row-span-3">
                <label className="block text-sm font-medium text-neutral-300 mb-1">Genres</label>
                <TagInputs search="genre" items={formState.genres || []}
                           onChange={(newData: string[]) => { onChange({ genres: newData}) }} />
              </div>
              <div className="xl:col-start-4 xl:row-start-1 xl:row-span-3">
                <label className="block text-sm font-medium text-neutral-300 mb-1">Directors</label>
                <TagInputs search="directors" items={formState.directors || []}
                           onChange={(newData: string[]) => { onChange({ directors: newData }) }} />
              </div>
              <div className="break-inside-avoid lg:col-start-3 lg:row-start-4 xl:col-start-4 xl:row-start-3">
                <ArtFetcher subject={formState.movie} placeholder={MOVIE_PLACEHOLDER}
                            onSelect={(url: string | null) => { onChange({ thumbnail: url }) }}
                            current={`thumbnails/movies/${formState.movie_id}.webp`} key={formState.movie_id} />
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
