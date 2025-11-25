import ListOfLinks from "../../utils/ListOfLinks";
import ClickableDate from "../../utils/ClickableDate";
import { API_ORIGIN } from "../../utils/BaseUrlContext";
import { BOOK_PLACEHOLDER } from "../../utils/placeholders";
import useEditor from "../../utils/editor/useEditor";
import useCacheBuster from "../../utils/useCacheBuster";
import type { BookCardProps } from "../../types/books";

export default function BookCard(props: BookCardProps) {
    const { book, onFilter } = props;
    const { openEditor } = useEditor();
    const [thumbnailVersion] = useCacheBuster();
    const onEdit = () => openEditor(book.book, book.book_id, book);

    return (
        <article className="m-2 rounded-lg border border-neutral-600 bg-neutral-800 p-3 shadow-sm">
          <div className="flex gap-3">
            <div className="w-20 h-30 shrink-0 overflow-hidden rounded bg-neutral-700">
              <img src={`${API_ORIGIN}/thumbnails/books/${book.book_id}.webp?v=${thumbnailVersion}`} alt={`${book.book} cover art`}
                   className="h-full w-full object-contain" loading="lazy"
                   onError={(e) => { e.currentTarget.src = BOOK_PLACEHOLDER; }} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold text-neutral-100">
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">#{book.book_id}</span>
                    <span className="flex items-center gap-1">
                      {book.read ? '✅' : '🟥'}
                      <span>{book.book}</span>
                    </span>
                    {book.comments && <span className="relative top-px select-none text-base text-blue-500" title={book.comments}>ⓘ</span>}
                  </h3>
                </div>
                <button className="shrink-0 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-700" type="button" onClick={() => onEdit()}>Edit</button>
              </div>

              <dl className="grid grid-cols-[92px_1fr] gap-x-2 gap-y-2 text-sm">
                <dt className="text-neutral-400">Release</dt>
                <dd className="text-neutral-100">
                  <ClickableDate date={book.release_date} onClick={(year: string) => onFilter({ type: 'SET_YEAR', value: year })} />
                </dd>
                <dt className="text-neutral-400">Genres</dt>
                <dd className="text-neutral-100">
                  <ListOfLinks items={book.genres} onClick={(genre: string) => onFilter({ type: 'SET_GENRE', value: genre })} />
                </dd>
                <dt className="text-neutral-400">Authors</dt>
                <dd className="text-neutral-100">
                  <ListOfLinks items={book.authors} onClick={(author: string) => onFilter({ type: 'SET_AUTHOR', value: author })} />
                </dd>
              </dl>
            </div>
          </div>
        </article>
    );
};
