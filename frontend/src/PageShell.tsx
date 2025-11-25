import type { ReactNode } from 'react';

type PageShellProps = {
    header?: ReactNode;
    info?: ReactNode;
    progress?: ReactNode;
    menu?: ReactNode;
    sidepanel?: ReactNode;
    scrubber?: ReactNode;
    timeline?: ReactNode;
    controls?: ReactNode;
    children: ReactNode;
};

export default function PageShell(props: PageShellProps) {
    return (
        <div className="w-full">
          <div>
            {props.header}
            {props.progress}
            {props.info}
          </div>
          <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[200px_minmax(0,1fr)_auto]">
            <aside className="hidden lg:block sticky top-14 h-screen">
              <div className="h-full overflow-y-auto">
                {props.menu}
              </div>
            </aside>
            <main className="min-w-0 overflow-x-auto">
              <div className="mt-4 px-2">
                <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-4">
                  {props.controls}
                </div>
              </div>
              <div className="hidden lg:block mt-4">
                {props.timeline}
              </div>
              {props.children}
            </main>
            <aside className="hidden lg:block sticky top-14 h-screen min-w-0 max-w-70">
              <div className="h-full overflow-y-auto overflow-x-hidden">
                {props.sidepanel}
              </div>
            </aside>
            <aside className="block md:hidden sticky top-18 h-[calc(100svh-4.5rem)]">
              <div className="h-full overflow-y-auto">
                {props.scrubber}
              </div>
            </aside>
          </div>
        </div>
    )
}