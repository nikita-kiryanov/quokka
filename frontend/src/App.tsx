import { useEffect, useState } from 'react';
import './App.css'
import ComputerGames from './computer_games/ComputerGames'
import React from 'react';
import Movies from './movies/Movies';
import TV from './tv/TV';
import HotSauces from './hot_sauces/HotSauces';
import Login from './auth/Login';
import { useAuth } from './auth/useAuth';

function Placeholder() {
  return <h1 className="text-4xl text-center">Work in progress</h1>;
}

function App() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <p className="text-neutral-400">Loading...</p>
    </div>;
  }

  if (!user) {
    return <Login />;
  }

  return <AuthenticatedApp onLogout={() => logout.mutate()} />;
}

function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
    const sections = ['Computer Games', 'Movies', 'TV', 'Books', 'Hot Sauces'];
    const sectionsJsx = [ComputerGames, Movies, TV, Placeholder, HotSauces];
    const icons = [
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>,
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="M10 2h4" />
          <path d="M9.5 4.5h5" />
          <path d="M10 4.5 v1.5 c0 .7-.3 1.3-.8 1.8 l-1.4 1.4 c-.6.6-.8 1.3-.8 2.1 v6.7 a2 2 0 0 0 2 2 h6 a2 2 0 0 0 2-2 v-6.7 c0-.8-.2-1.5-.8-2.1 l-1.4-1.4 c-.5-.5-.8-1.1-.8-1.8 v-1.5 z" />
          <path d="M9 12h6" />
        </svg>
    ];
    const [selected, setSelected] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const onMobileMenuItemClick = (index: number) => {
        setSelected(index);
        setIsMobileMenuOpen(false);
    };

    const selectSection = (index: number) => {
        setSelected(index);
        sessionStorage.setItem('selectedSection', index.toString());
    }

    useEffect(() => {
        const selectedSection = sessionStorage.getItem('selectedSection');
        if (selectedSection) {
            setSelected(parseInt(selectedSection));
        }
    }, []);

    return (
      <div className="grid grid-rows-[auto_1fr]">
        <nav className="sticky top-0 mb-4 bg-neutral-900 z-20">
          <div className="md:hidden px-4 py-3">
            <button className="flex w-full items-center justify-between rounded-md border border-neutral-700 bg-neutral-800 px-4 py-3 text-left text-white"
                    type="button" onClick={() => setIsMobileMenuOpen((open) => !open)}
                    aria-expanded={isMobileMenuOpen} aria-controls="mobile-nav-menu">
              <span className="flex items-center gap-2 font-semibold">
                {icons[selected]} {sections[selected]}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth={1.8}
                   className={"size-5 transition-transform" + (isMobileMenuOpen ? " rotate-180" : "")}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {isMobileMenuOpen && (
              <ul id="mobile-nav-menu" className="mt-2 rounded-md border border-neutral-700 bg-neutral-800 py-1 shadow-lg">
                {sections.map((section, index) =>
                  <li className={"flex cursor-pointer gap-2 px-4 py-3 text-white hover:bg-neutral-700" + (selected === index ? " bg-neutral-700" : "")}
                      key={index} onClick={() => onMobileMenuItemClick(index)}>
                    {icons[index]} {section}
                  </li>
                )}
                <li className="flex cursor-pointer gap-2 px-4 py-3 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                    onClick={() => { setIsAboutOpen(true); setIsMobileMenuOpen(false); }}>
                  About
                </li>
                <li className="flex cursor-pointer gap-2 border-t border-neutral-700 px-4 py-3 text-neutral-400 hover:bg-neutral-700 hover:text-white" onClick={onLogout}>
                  Log out
                </li>
              </ul>
            )}
          </div>
          <div className="hidden md:flex items-center">
            <ul className="flex flex-1 justify-center">
              {sections.map((section, index) =>
                <li className="inline-flex px-4 lg:px-8 pt-4 pb-4 select-none cursor-pointer text-white hover:bg-neutral-600"
                    key={index} onClick={() => selectSection(index)}>
                  <div className={"flex font-bold text-lg" + (selected === index ? " border-b-2 text-blue-500" : "")}
                       title={section}>
                    {icons[index]} <span className="hidden lg:inline">{section}</span>
                  </div>
                </li>
              )}
            </ul>
            <button className="rounded px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-700 hover:text-white" onClick={() => setIsAboutOpen(true)}>
              About
            </button>
            <button className="mr-4 rounded px-3 py-1.5 text-sm text-neutral-400 hover:bg-neutral-700 hover:text-white" onClick={onLogout}>
              Log out
            </button>
          </div>
        </nav>
        {React.createElement(sectionsJsx[selected])}
        {isAboutOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-neutral-900/50 backdrop-blur z-30"
               onClick={(e) => (e.target === e.currentTarget) && setIsAboutOpen(false)}>
            <div className="rounded-xl border border-blue-500 bg-neutral-700 p-6 text-center max-w-sm w-full mx-4">
              <h2 className="text-xl font-semibold text-white mb-4">About</h2>
              <div className="flex flex-col items-center gap-2 text-sm text-neutral-300">
                <img src="/tmdb-logo.svg" alt="TMDB" className="h-4 opacity-80" />
                <p>This website uses the TMDB API but is not endorsed, certified, or otherwise approved by TMDB.</p>
              </div>
              <button className="mt-5 rounded px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-600 hover:text-white"
                      onClick={() => setIsAboutOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    )
}

export default App
