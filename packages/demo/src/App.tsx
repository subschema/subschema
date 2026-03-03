import { useState, useEffect, useCallback } from 'react';
import { cn } from '@subschema/react';
import { examples } from './examples';
import { ExamplePage } from './ExamplePage';
import { SchemaEditorPage } from './SchemaEditorPage';
import { CustomTypePage } from './CustomTypePage';
import { PresetPage } from './PresetPage';

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash.replace('#/', '') || examples[0].id);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash.replace('#/', '') || examples[0].id);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return hash;
}

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('subschema-dark');
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('subschema-dark', String(dark));
  }, [dark]);
  return [dark, setDark] as const;
}

export function App() {
  const currentId = useHash();
  const [dark, setDark] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentExample = examples.find((e) => e.id === currentId) ?? examples[0];

  const navigate = useCallback((id: string) => {
    window.location.hash = `#/${id}`;
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button
            className="rounded p-1 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Subschema Modern Demo</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="rounded-md p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <a
            href="https://github.com/subschema/subschema"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-2 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            GitHub
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <nav
          className={cn(
            'z-40 w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900',
            'fixed inset-y-0 left-0 transform transition-transform md:static md:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'top-0 pt-14 md:top-auto md:pt-0',
          )}
        >
          <div className="p-3">
            <h2 className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
              Examples
            </h2>
            <ul className="space-y-0.5">
              {examples.map((ex) => (
                <li key={ex.id}>
                  <button
                    onClick={() => navigate(ex.id)}
                    className={cn(
                      'w-full rounded-md px-3 py-2 text-left text-sm transition',
                      currentId === ex.id
                        ? 'bg-blue-100 font-medium text-blue-900 dark:bg-blue-900/40 dark:text-blue-200'
                        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800',
                    )}
                  >
                    {ex.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentExample.id === 'editor' ? (
            <SchemaEditorPage example={currentExample} />
          ) : currentExample.id === 'custom-type' ? (
            <CustomTypePage example={currentExample} />
          ) : currentExample.id === 'preset' ? (
            <PresetPage example={currentExample} />
          ) : (
            <ExamplePage key={currentExample.id} example={currentExample} />
          )}
        </main>
      </div>
    </div>
  );
}
