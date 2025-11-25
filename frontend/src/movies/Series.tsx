import MovieRow from "./displays/MovieRow";
import MovieCard from "./displays/MovieCard";
import type { SeriesProps, Movie } from "../types/movies";

export default function Series({ name, entry, onFilter }: SeriesProps) {
    const { movies, anchorId } = entry;
    return (
      <>
        <h1 id={anchorId} className="text-4xl scroll-mt-18">{name}</h1>
        <div className="hidden md:block">
          <table className="table-auto w-full text-sm text-left">
            <thead className="bg-neutral-800 text-neutral-400 uppercase tracking-wider text-xs font-semibold">
              <MovieRow headerOnly={true} />
            </thead>
            <tbody className="divide-y divide-neutral-600">
              {movies.map((movie: Movie) => (
                <MovieRow key={movie.movie_id} movie={movie} onFilter={onFilter} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden">
          {movies.map((movie: Movie) => (
            <MovieCard key={movie.movie_id} movie={movie} onFilter={onFilter} />
          ))}
        </div>
      </>
    )
};