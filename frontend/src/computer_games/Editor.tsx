import { useCallback, useMemo, useState, type ReactNode } from "react";
import { EditorContext } from "../utils/editor/useEditor";
import TagInputs from "../utils/editor/TagInputs";
import useDataSet from "../utils/editor/useDataSet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBaseUrl } from "../utils/BaseUrlContext";
import InputLabelDataList from "../utils/editor/InputLabelDataList";
import { ArtFetcher } from "../utils/ArtFetcher";
import { GAME_PLACEHOLDER } from "../utils/placeholders";
import useCacheBuster from "../utils/useCacheBuster";
import { Checkbox } from "../utils/elements/Checkbox";
import Input from "../utils/elements/Input";
import Button from "../utils/elements/Button";

const SGDB_API = '/sgdb';
const API_KEY = import.meta.env.VITE_SGDB_API_KEY || '';

type InputChange = React.ChangeEvent<HTMLInputElement>;
type TextAreaChange = React.ChangeEvent<HTMLTextAreaElement>;

export function EditorProvider({ children }: { children: ReactNode }) {
    const baseUrl = useBaseUrl();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState<string>('');
    const [formState, setFormState] = useState<any>(null);
    const [_, setNextVersion] = useCacheBuster();

    const series = useDataSet('dataset/series', formState != null);
    const franchise = useDataSet('dataset/franchise', formState != null);
    const games = useDataSet('dataset/games', formState != null);

    const payloadTranslator = (data: any) => {
        const payload: any = {
            games: {
                played: data.played || false,
                dlc_for: data.dlc_for_name || null,
                comments: data.comments || null,
                game_name: data.game,
                remake_for: data.remake_for_name || null,
                series_name: data.series || null,
                franchise_name: data.franchise || null,
                chronology_date: data.chronology_date || null,
                initial_release_date: data.initial_release_date || null,
            },
            games_to_game_genres: {
                game_genres: data.game_genres || [],
            },
            games_to_content_genres: {
                content_genres: data.content || [],
            },
            games_to_developers: {
                developers: data.developers || [],
            },
            game_id: data.game_id || null,
            thumbnail: data.thumbnail,
        };

        return payload;
    }

    const mutation = useMutation({
        mutationFn: async (newGame: any): Promise<{success: boolean}> => {
            const url = baseUrl + 'games' + (newGame.game_id ? `/${newGame.game_id}` : '');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
              body: JSON.stringify(payloadTranslator(newGame)),
            });

            if (!response.ok) {
                throw new Error(`Failed to create game: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['computer-games']});
            setNextVersion();
            closeEditor();
        },
    });

    function onChange(data: Object) {
        setFormState((prevState: Object) => ({ ...prevState, ...data }));
    }

    const openEditor = useCallback(function openEditor(title: string, id: number | null, content: any) {
        setFormState({...content, game_id: id});
        setTitle(title);
    }, []);

    const closeEditor = useCallback(function closeEditor() {
        setFormState(null);
        setTitle('');
    }, []);

    const contextValue = useMemo(() => ({ openEditor, closeEditor }), [openEditor, closeEditor]);

    async function fetchArt(gameName: string) {
        async function sgdbFetch(path: string) {
            const res = await fetch(`${SGDB_API}${path}`, {
                headers: { Authorization: `Bearer ${API_KEY}` },
            });
            if (!res.ok) throw new Error(`SteamGridDB error: ${res.status}`);
            const json = await res.json();
            return json.data;
        }
        const games = await sgdbFetch(`/search/autocomplete/${encodeURIComponent(gameName)}`);
        const game = games[0];
        return sgdbFetch(`/grids/game/${game.id}`);
    }

    const artSearchName = () => {
        if (!formState.game) return '';
        let name = formState.game;
        if (formState.initial_release_date) {
            const year = formState.initial_release_date.slice(0, 4);
            name += ` (${year})`;
        }
        return name;
    };

    if (!series.isFetched || !franchise.isFetched || !games.isFetched || !formState) {
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
              <div className="grid grid-cols-1 sm:block sm:columns-2 sm:space-y-4 lg:grid lg:columns-auto lg:space-y-0 lg:grid-cols-3 xl:grid-cols-6 w-full gap-4">
                <div className="break-inside-avoid lg:col-start-1 lg:row-start-1 xl:col-start-1 xl:row-start-1">
                  <InputLabelDataList label="Name" name="game" id="i-game" value={formState.game || ''}
                                      onChange={(e: InputChange) => { onChange({ game: e.target.value }) }} />
                </div>
                <div className="break-inside-avoid lg:col-start-1 lg:row-start-2 xl:col-start-1 xl:row-start-2">
                  <InputLabelDataList label="Series" name="series" id="i-series"
                                      value={formState.series || ''} suggestions={series.data}
                                      onChange={(e: InputChange) => { onChange({ series: e.target.value }) }} />
                </div>
                <div className="break-inside-avoid lg:col-start-1 lg:row-start-3 xl:col-start-1 xl:row-start-3">
                  <InputLabelDataList label="Franchise" name="franchise" id="i-franchise"
                                      value={formState.franchise || ''} suggestions={franchise.data}
                                      onChange={(e: InputChange) => onChange({ franchise: e.target.value })} />
                  <Checkbox name="played" id="i-played" label="Played" checked={formState.played || false}
                            onChange={(e: InputChange) => onChange({ played: e.target.checked })} />
                </div>
                <div className="break-inside-avoid lg:col-start-2 lg:row-start-1 xl:col-start-2 xl:row-start-1">
                  <InputLabelDataList label="DLC For" name="dlc" id="i-dlc"
                                      value={formState.dlc_for_name || ''} suggestions={games.data}
                                      onChange={(e: InputChange) => { onChange({ dlc_for_name: e.target.value }) }} />
                </div>
                <div className="break-inside-avoid lg:col-start-2 lg:row-start-2 xl:col-start-2 xl:row-start-2">
                  <InputLabelDataList label="Remake For" name="remake" id="i-remake"
                                      value={formState.remake_for_name || ''} suggestions={games.data}
                                      onChange={(e: InputChange) => { onChange({ remake_for_name: e.target.value }) }} />
                </div>
                <div className="break-inside-avoid lg:col-start-2 lg:row-start-3 xl:col-start-3 xl:row-start-1">
                  <Input type="date" name="release-date" id="i-release-date" label="Release Date"
                         value={formState.initial_release_date || ''}
                         onChange={(e: InputChange) => { onChange({ initial_release_date: e.target.value }) }} />
                </div>
                <div className="break-inside-avoid lg:col-start-2 lg:row-start-4 xl:col-start-3 xl:row-start-2">
                  <Input type="date" name="chronology-date" id="i-chronology-date" label="Chronology Date"
                         value={formState.chronology_date || ''}
                         onChange={(e: InputChange) => { onChange({ chronology_date: e.target.value }) }} />
                </div>
                <div className="break-inside-avoid lg:col-start-1 lg:row-start-4 xl:col-start-2 xl:row-start-3 xl:col-span-2">
                  <label htmlFor="i-comments" className="block text-sm font-medium text-neutral-300 mb-1">
                    Comments
                  </label>
                  <textarea className="w-full min-h-20 rounded-md border border-blue-500 bg-neutral-700/50 p-2 text-left text-sm"
                            name="comments" id="i-comments" value={formState.comments || ''}
                            onChange={(e: TextAreaChange) => { onChange({ comments: e.target.value }) }} />
                </div>
                <div className="break-inside-avoid lg:col-start-3 lg:row-start-1 xl:col-start-4 xl:row-start-1 xl:row-span-3">
                  <TagInputs search="genre" items={formState.game_genres || []} label="Genres"
                             onChange={(newData: string[]) => { onChange({ game_genres: newData}) }} />
                </div>
                <div className="break-inside-avoid lg:col-start-3 lg:row-start-2 xl:col-start-5 xl:row-start-1 xl:row-span-3">
                  <TagInputs search="content" items={formState.content || []} label="Content"
                            onChange={(newData: string[]) => { onChange({ content: newData }) }} />
                </div>
                <div className="break-inside-avoid lg:col-start-3 lg:row-start-3 xl:col-start-6 xl:row-start-1 xl:row-span-3">
                  <TagInputs search="developer" items={formState.developers || []} label="Developers"
                             onChange={(newData: string[]) => { onChange({ developers: newData }) }} />
                </div>
                <div className="break-inside-avoid lg:col-start-3 lg:row-start-4 xl:col-start-4 xl:row-start-3">
                  <ArtFetcher subject={artSearchName()} fetch={fetchArt}
                              onSelect={(url: string | null) => { onChange({ thumbnail: url }) }}
                              current={`thumbnails/games/${formState.game_id}.png`} key={formState.game_id}
                              placeholder={GAME_PLACEHOLDER} />
                  <Input type="file" name="file-upload" id="i-file-upload" label="OR" accept="image/*"
                         onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                                 const reader = new FileReader();
                                 reader.onload = () => {
                                     const base64String = reader.result as string;
                                     onChange({ thumbnail: base64String });
                                 }
                                 reader.readAsDataURL(file);
                             }
                         }} />
                </div>
                <div className="break-inside-avoid col-span-full xl:col-start-1 xl:row-start-5 xl:col-span-6 flex gap-2 justify-center">
                  <Button onClick={() => { mutation.mutate(formState) }} text="Save" />
                  <Button onClick={() => closeEditor()} text="Cancel" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </EditorContext.Provider>
    );
}
