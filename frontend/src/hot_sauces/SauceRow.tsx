import ListOfLinks from "../utils/ListOfLinks";
import { API_ORIGIN } from "../utils/BaseUrlContext";
import { SAUCE_PLACEHOLDER } from "../utils/placeholders";
import type { SauceRowProps } from "../types/hot-sauces";
import { useEditor } from "./Editor";

export default function SauceRow(props: SauceRowProps) {
    const { openEditor } = useEditor();

    if (props.headerOnly) {
        return (
            <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Sauce</th>
                <th className="px-6 py-3">Peppers</th>
                <th className="px-6 py-3">Comments</th>
                <th className="px-6 py-3">Edit</th>
            </tr>
        );
    }

    const { sauce, onPepper } = props;

    return (
      <>
        <tr className="hidden bg-neutral-700 transition-colors hover:bg-neutral-600 md:table-row">
          <td className="whitespace-nowrap px-6 py-2 text-neutral-100">{sauce.sauce_id}</td>
          <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
            {sauce.sauce}
          </td>
          <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
            <ListOfLinks items={sauce.peppers} onClick={onPepper} />
          </td>
          <td className="px-6 py-2 text-neutral-100">
            {sauce.comments}
          </td>
          <td className="whitespace-nowrap px-6 py-2 text-neutral-100">
            <button className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-700"
                    type="button" onClick={() => openEditor(sauce.sauce, sauce.sauce_id, sauce)}>Edit</button>
          </td>
        </tr>

        <tr className="md:hidden">
          <td colSpan={5} className="p-0">
            <article className="m-2 rounded-lg border border-neutral-600 bg-neutral-800 p-3 shadow-sm">
              <div className="flex gap-3">
                <div className="aspect-2/3 w-20 shrink-0 overflow-hidden rounded bg-neutral-700">
                  <img src={`${API_ORIGIN}/thumbnails/${sauce.sauce_id}.png`} alt={`${sauce.sauce} cover art`}
                        className="h-full w-full object-contain" loading="lazy"
                        onError={(e) => { e.currentTarget.src = SAUCE_PLACEHOLDER; }} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold text-neutral-100">
                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">#{sauce.sauce_id}</span>
                        <span>{sauce.sauce}</span>
                      </h3>
                    </div>
                    <button className="shrink-0 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-700"
                            type="button" onClick={() => openEditor(sauce.sauce, sauce.sauce_id, sauce)}>Edit</button>
                  </div>

                  <dl className="grid grid-cols-[92px_1fr] gap-x-2 gap-y-2 text-sm">
                    <dt className="text-neutral-400">Peppers</dt>
                    <dd className="text-neutral-100">
                      <ListOfLinks items={sauce.peppers} onClick={onPepper} />
                    </dd>
                    {sauce.comments && <>
                      <dt className="text-neutral-400">Comments</dt>
                      <dd className="text-neutral-100">{sauce.comments}</dd>
                    </>}
                  </dl>
                </div>
              </div>
            </article>
          </td>
        </tr>
      </>
    );
};