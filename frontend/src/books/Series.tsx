import BookRow from "./displays/BookRow";
import BookCard from "./displays/BookCard";
import type { SeriesProps, Book } from "../types/books";

export default function Series({ name, entry, onFilter }: SeriesProps) {
    const { books, anchorId } = entry;
    return (
      <>
        <h1 id={anchorId} className="text-4xl scroll-mt-18">{name}</h1>
        <div className="hidden md:block">
          <table className="table-auto w-full text-sm text-left">
            <thead className="bg-neutral-800 text-neutral-400 uppercase tracking-wider text-xs font-semibold">
              <BookRow headerOnly={true} />
            </thead>
            <tbody className="divide-y divide-neutral-600">
              {books.map((book: Book) => (
                <BookRow key={book.book_id} book={book} onFilter={onFilter} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden">
          {books.map((book: Book) => (
            <BookCard key={book.book_id} book={book} onFilter={onFilter} />
          ))}
        </div>
      </>
    )
};