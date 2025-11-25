import { useQuery } from "@tanstack/react-query";
import { useBaseUrl } from "./BaseUrlContext";

/** Fetches a genre hierarchy and renders it as an indented nav list with selection highlighting. */
export default function GenresTree({ url, onClick, selected }: GenresTree) {
    const path = useBaseUrl(url).href;
    const queryGenreTree = useQuery({
        queryKey: [path], queryFn: async () => {
            return fetch(path).then(res => res.json());
        }
    });

    const genres = queryGenreTree.data?.genres || [];

    const selectedGenreStyle = (genre: string) => {
        return selected == genre ? 'text-blue-400 bg-neutral-600' : 'text-blue-400';
    }

    if (queryGenreTree.isError)
        return <p>Error: {queryGenreTree.error.message}</p>;

    return (
        <nav>
          <ul>
            {genres.map(function (genre: GenreTuple, index: number) {
              const name = genre['secondary'] ? genre['secondary'] : genre['primary'];
              const indent = genre['secondary'] ? "pl-6" : "font-bold pl-2";
              return (
                <li className={[indent, selectedGenreStyle(name)].join(' ')} key={index}>
                  <a href="#" onClick={(e) => { e.preventDefault(); onClick(name); }}>
                    {name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
    )
};