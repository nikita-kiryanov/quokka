import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import PullToRefresh from 'react-simple-pull-to-refresh';
import App from './App.tsx'

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
}

const _fetch = globalThis.fetch;
globalThis.fetch = (input, init) => _fetch(input, { ...init, credentials: 'include' });

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PullToRefresh onRefresh={() => queryClient.invalidateQueries()} pullingContent={<div className="text-center text-neutral-400">Pull to refresh</div>} refreshingContent={<div className="text-center text-neutral-400">Refreshing...</div>}>
        <App />
      </PullToRefresh>
    </QueryClientProvider>
  </StrictMode>,
)
