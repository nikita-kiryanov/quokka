import React from "react";

/** Renders a comma-separated list of clickable links. */
export default function ListOfLinks({ items, onClick }: ListOfLinks) {
    if (!items)
        return null;

    const tokens = items.map(item => item?.trim());
    const onClickHandler = (token: string) => {
        onClick(token);
        window.scrollTo({ top: 0 });
    };

    return (
        <>
          {tokens.map((token: string, index: number) => (
            <React.Fragment key={index}>
              <a key={index} href="" onClick={(e) => { e.preventDefault(); onClickHandler(token); }} className="text-blue-400 hover:underline">
                {token}
              </a>{index < tokens.length - 1 ? ', ' : ''}
            </React.Fragment>
          ))}
        </>
    )
}