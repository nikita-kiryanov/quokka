import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useBaseUrl } from "./BaseUrlContext";

type ListItem = {
    type: string;
    item: string;
};

type List = Record<string, ListItem[]>;

/** Collapsible sidebar that fetches and displays grouped lists of items with headers. */
export default function SidePanel({ url, open }: SidePanel) {
    const path = useBaseUrl(url);
    const [sidebarOpen, setSidebarOpen] = useState(open);
    const query = useQuery({
        queryKey: [], queryFn: async () => {
            return fetch(path).then(res => res.json());
        }
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const lists: List = query.data?.lists || [];

    if (query.isError) return <p>Error: {query.error.message}</p>;

    if (!lists) return null;

    return (
        <div className={["flex h-screen overflow-y-auto", open ? "block" : "hidden"].join(' ')}>
          <div onClick={toggleSidebar} className="w-3 hover:bg-slate-700" />
          <div className="">
            {Object.entries(lists).map(([name, items]) => {
                return (
                    <Fragment key={name}>
                      <h2 className="text-2xl font-semibold mt-6 mb-3">{name}</h2>
                      <hr />
                      {items.map((item: ListItem, index: number) =>
                          item.type == 'Header' ? (
                              <h3 className="text-xl font-semibold mt-4 mb-2" key={index}>{item.item}</h3>
                          ) : (
                              <p key={index}>{item.item}</p>
                          )
                      )}
                    </Fragment>
                );
            })}
          </div>
        </div>
    )
};