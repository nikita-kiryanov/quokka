import SauceRow from "./SauceRow";
import type { BrandProps, Sauce } from "../types/hot-sauces";

export default function Brand({ name, sauces, onPepper }: BrandProps) {
    return (
      <>
        <h1 className="text-4xl">{name}</h1>
        <table className="table-auto w-full text-sm text-left">
          <thead className="hidden bg-neutral-800 text-neutral-400 uppercase tracking-wider text-xs font-semibold md:table-header-group">
            <SauceRow headerOnly={true} />
          </thead>
          <tbody className="md:divide-y md:divide-neutral-600">
            {sauces.map((sauce: Sauce) => {
              return (
                <SauceRow key={sauce.sauce_id} sauce={sauce} onPepper={onPepper} />
              );
            })}
          </tbody>
        </table>
      </>
    )
};