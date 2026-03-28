'use client';

import { useEffect, useState } from 'react';
import { usePlayground } from '../hooks/usePlayground';
import { ThemeFiles } from '../types';

interface PlaygroundPreviewProps {
  themeFiles?: ThemeFiles;
  themeSlug?: string;
}

export function PlaygroundPreview({ themeFiles, themeSlug }: PlaygroundPreviewProps) {
  const { ready, loading, error, iframeRef, boot, loadTheme } = usePlayground();
  const [view, setView] = useState<'preview' | 'files'>('preview');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  useEffect(() => {
    if (themeFiles && themeSlug) {
      if (ready) loadTheme(themeFiles, themeSlug);
      else if (!loading) boot();
    }
  }, [themeFiles, themeSlug, ready, loading, boot, loadTheme]);

  const hasTheme = !!themeFiles;
  const showEmpty = !hasTheme && !loading && !error;

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-10 shrink-0 flex items-center justify-between px-4 border-b border-[var(--color-border)] bg-white">
        <div className="flex items-center gap-2">
          <div className="flex items-center h-7 px-3 bg-[var(--color-bg-muted)] rounded-md">
            <svg className="w-3 h-3 text-[var(--color-text-muted)] mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" /></svg>
            <span className="text-[11px] text-[var(--color-text-muted)] truncate max-w-[200px]">
              {hasTheme ? `${themeSlug || 'theme'}.developer.blog` : 'Live Preview'}
            </span>
          </div>
        </div>
        {hasTheme && !loading && (
          <div className="flex items-center gap-0.5 bg-[var(--color-bg-muted)] rounded-lg p-0.5">
            <ToolBtn active={view === 'preview'} onClick={() => setView('preview')} title="Preview">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
            </ToolBtn>
            <ToolBtn active={view === 'files'} onClick={() => { setView('files'); setSelectedFile(null); }} title="Files">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </ToolBtn>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 relative">
        {loading && (
          <Overlay>
            <div className="relative">
              <div className="w-12 h-12 border-2 border-[var(--color-accent)]/20 rounded-full" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm mt-4">Loading WordPress Playground...</p>
          </Overlay>
        )}

        {error && !loading && (
          <Overlay>
            <div className="w-12 h-12 rounded-full bg-[var(--color-error-soft)] flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            </div>
            <p className="text-[var(--color-error)] text-sm font-medium mb-1">Playground failed to load</p>
            <p className="text-[var(--color-text-muted)] text-xs max-w-sm">{error}</p>
          </Overlay>
        )}

        {showEmpty && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[var(--color-bg-page)] to-[var(--color-bg-muted)]">
            <div className="text-center max-w-xs px-6 animate-[fadeIn_0.4s_ease-out]">
              {/* Animated illustration */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-3xl bg-[var(--color-accent-soft)] animate-[float_4s_ease-in-out_infinite]" />
                <div className="absolute inset-2 rounded-2xl bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/10 flex items-center justify-center animate-[float_4s_ease-in-out_infinite_0.3s]">
                  <svg className="w-10 h-10 text-[var(--color-accent)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-bold text-[var(--color-text)] mb-2">Live Preview</h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                Your generated theme will render here in a live WordPress environment powered by Playground.
              </p>
            </div>
          </div>
        )}

        {view === 'files' && hasTheme && themeFiles && (
          <div className="absolute inset-0 flex animate-[fadeIn_0.2s_ease-out]">
            <div className="w-56 shrink-0 border-r border-[var(--color-border)] overflow-y-auto p-3 bg-[var(--color-bg-sidebar)]">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 px-1">Theme Files</p>
              <FileTree themeFiles={themeFiles} onSelect={setSelectedFile} selected={selectedFile} />
            </div>
            <div className="flex-1 overflow-auto p-4 bg-[var(--color-bg-page)]">
              {selectedFile ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <FileIcon ext={selectedFile.split('.').pop()} />
                    <span className="text-xs text-[var(--color-text-muted)] font-mono">{selectedFile}</span>
                  </div>
                  <pre className="text-xs text-[var(--color-text-secondary)] font-mono whitespace-pre-wrap bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] p-4 border border-[var(--color-border)] shadow-[var(--shadow-card)] leading-relaxed">{getFileContent(themeFiles, selectedFile)}</pre>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-[var(--color-text-muted)]/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    <p className="text-[var(--color-text-muted)] text-sm">Select a file to view</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <iframe ref={iframeRef} className={view === 'preview' && hasTheme && !error ? 'absolute inset-0 w-full h-full' : 'absolute inset-0 w-0 h-0 opacity-0 pointer-events-none'} />
      </div>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--color-bg-page)]/95 backdrop-blur-sm text-center">{children}</div>;
}

function ToolBtn({ active, onClick, title, children }: { active: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return <button onClick={onClick} title={title} className={`p-1.5 rounded-md transition-all duration-200 ${active ? 'text-[var(--color-accent)] bg-[var(--color-bg-card)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}>{children}</button>;
}

function FileIcon({ isDir, ext }: { isDir?: boolean; ext?: string }) {
  const c = isDir ? 'text-[var(--color-accent)]' : { php: 'text-purple-500', json: 'text-yellow-600', css: 'text-blue-500', html: 'text-orange-500' }[ext || ''] || 'text-[var(--color-text-muted)]';
  return isDir
    ? <svg className={`w-4 h-4 ${c} shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
    : <svg className={`w-4 h-4 ${c} shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
}

function FileTree({ themeFiles, onSelect, selected }: { themeFiles: ThemeFiles; onSelect: (f: string) => void; selected: string | null }) {
  const roots = ['style.css', 'theme.json', 'functions.php', 'readme.txt'] as const;
  const dirs = [{ name: 'templates', files: Object.keys(themeFiles.templates) }, { name: 'parts', files: Object.keys(themeFiles.parts) }, { name: 'patterns', files: Object.keys(themeFiles.patterns) }];
  return (
    <div className="font-mono text-xs space-y-px">
      {roots.map(f => <TreeRow key={f} name={f} ext={f.split('.').pop()} active={selected === f} onClick={() => onSelect(f)} />)}
      {dirs.map(d => (
        <div key={d.name} className="mt-2">
          <div className="flex items-center gap-1.5 py-1 px-1 text-[var(--color-text-secondary)] font-semibold"><FileIcon isDir /><span>{d.name}/</span></div>
          {d.files.map(f => <TreeRow key={f} name={f} ext={f.split('.').pop()} indent active={selected === `${d.name}/${f}`} onClick={() => onSelect(`${d.name}/${f}`)} />)}
        </div>
      ))}
    </div>
  );
}

function TreeRow({ name, ext, indent, active, onClick }: { name: string; ext?: string; indent?: boolean; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`w-full flex items-center gap-1.5 py-1.5 px-2 rounded-[var(--radius-md)] text-left transition-all duration-150 ${indent ? 'ml-3' : ''} ${active ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-medium' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'}`}><FileIcon ext={ext} /><span className="truncate">{name}</span></button>;
}

function getFileContent(files: ThemeFiles, path: string): string {
  const m: Record<string, string> = { 'style.css': files['style.css'], 'theme.json': files['theme.json'], 'functions.php': files['functions.php'], 'readme.txt': files['readme.txt'] };
  if (m[path] !== undefined) return m[path];
  const [dir, ...r] = path.split('/');
  const n = r.join('/');
  return (dir === 'templates' ? files.templates : dir === 'parts' ? files.parts : files.patterns)[n] || '';
}
