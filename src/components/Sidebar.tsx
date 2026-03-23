'use client';

import { useState, useEffect } from 'react';
import { ThemeFiles } from '../types';
import { Button } from './ui/button';

interface SavedProject {
  id: string;
  name: string;
  slug: string;
  timestamp: number;
  files: ThemeFiles;
  zipBase64: string;
}

interface SidebarProps {
  currentResult: { files: ThemeFiles; themeSlug: string; zipBase64: string } | null;
  onLoadProject: (project: SavedProject) => void;
  onReset: () => void;
}

type Panel = 'projects' | 'settings' | 'help' | null;

export function Sidebar({ currentResult, onLoadProject, onReset }: SidebarProps) {
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [projects, setProjects] = useState<SavedProject[]>([]);

  // Load saved projects from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wp-theme-projects');
      if (saved) setProjects(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Auto-save current result
  useEffect(() => {
    if (!currentResult) return;
    const existing = projects.find(p => p.slug === currentResult.themeSlug);
    if (existing) return; // already saved

    const project: SavedProject = {
      id: Date.now().toString(),
      name: currentResult.themeSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      slug: currentResult.themeSlug,
      timestamp: Date.now(),
      files: currentResult.files,
      zipBase64: currentResult.zipBase64,
    };

    const updated = [project, ...projects].slice(0, 10); // keep last 10
    setProjects(updated);
    try { localStorage.setItem('wp-theme-projects', JSON.stringify(updated)); } catch { /* quota */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResult?.themeSlug]);

  const togglePanel = (panel: Panel) => setActivePanel(prev => prev === panel ? null : panel);

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    try { localStorage.setItem('wp-theme-projects', JSON.stringify(updated)); } catch { /* */ }
  };

  return (
    <aside className="w-48 shrink-0 flex flex-col bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)]">
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">Workspace</p>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        <NavBtn active={activePanel === 'projects'} onClick={() => togglePanel('projects')} icon={<FolderIcon />} badge={projects.length > 0 ? projects.length : undefined}>
          Projects
        </NavBtn>
        <NavBtn active={activePanel === 'settings'} onClick={() => togglePanel('settings')} icon={<CogIcon />}>
          Settings
        </NavBtn>
        <NavBtn active={activePanel === 'help'} onClick={() => togglePanel('help')} icon={<HelpIcon />}>
          Help
        </NavBtn>
      </nav>

      <div className="p-3 border-t border-[var(--color-border)]">
        <Button onClick={onReset} variant="primary" size="md" className="w-full text-xs">
          New Theme
        </Button>
      </div>

      {/* Slide-out panel */}
      {activePanel && (
        <div className="absolute left-48 top-12 bottom-0 w-72 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] shadow-[var(--shadow-md)] z-20 flex flex-col animate-[fadeIn_0.15s_ease-out]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              {activePanel === 'projects' ? 'Projects' : activePanel === 'settings' ? 'Settings' : 'Help'}
            </span>
            <button onClick={() => setActivePanel(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activePanel === 'projects' && <ProjectsPanel projects={projects} onLoad={onLoadProject} onDelete={deleteProject} />}
            {activePanel === 'settings' && <SettingsPanel />}
            {activePanel === 'help' && <HelpPanel />}
          </div>
        </div>
      )}
    </aside>
  );
}

function ProjectsPanel({ projects, onLoad, onDelete }: { projects: SavedProject[]; onLoad: (p: SavedProject) => void; onDelete: (id: string) => void }) {
  if (projects.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)] text-center py-8">No saved themes yet. Generate your first theme to see it here.</p>;
  }
  return (
    <div className="space-y-2">
      {projects.map(p => (
        <div key={p.id} className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 hover:bg-[var(--color-bg-hover)] transition-colors group">
          <div className="flex items-start justify-between">
            <button onClick={() => onLoad(p)} className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text)] truncate">{p.name}</p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                {Object.keys(p.files.templates).length} templates &middot; {Object.keys(p.files.patterns).length} patterns
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                {new Date(p.timestamp).toLocaleDateString()} {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </button>
            <button onClick={() => onDelete(p.id)} className="text-[var(--color-text-muted)] hover:text-[var(--color-error)] opacity-0 group-hover:opacity-100 transition-opacity p-1" title="Delete">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsPanel() {
  const [provider, setProvider] = useState('auto');
  useEffect(() => {
    const saved = localStorage.getItem('wp-theme-provider');
    if (saved) setProvider(saved);
  }, []);
  const handleChange = (val: string) => {
    setProvider(val);
    localStorage.setItem('wp-theme-provider', val);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">AI Provider</label>
        <select value={provider} onChange={e => handleChange(e.target.value)} className="w-full px-3 py-2 bg-[var(--color-bg-input)] border border-[var(--color-border-input)] rounded-[var(--radius-md)] text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20">
          <option value="auto">Auto (cheapest available)</option>
          <option value="anthropic">Anthropic (direct)</option>
          <option value="openrouter">OpenRouter</option>
        </select>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Auto uses OpenRouter when available, falls back to Anthropic.</p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Theme History</label>
        <button onClick={() => { localStorage.removeItem('wp-theme-projects'); window.location.reload(); }} className="text-xs text-[var(--color-error)] hover:underline">
          Clear all saved projects
        </button>
      </div>
    </div>
  );
}

function HelpPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-bold text-[var(--color-text)] mb-2">How it works</h3>
        <ol className="text-xs text-[var(--color-text-secondary)] space-y-1.5 list-decimal list-inside">
          <li>Describe your theme in natural language</li>
          <li>Optionally set colors, typography, and layout preferences</li>
          <li>Click Generate — the AI builds a complete block theme</li>
          <li>Preview it live in WordPress Playground</li>
          <li>Download the .zip and install on any WordPress site</li>
        </ol>
      </div>
      <div>
        <h3 className="text-xs font-bold text-[var(--color-text)] mb-2">Keyboard shortcuts</h3>
        <div className="space-y-1.5">
          <KbdRow keys="Ctrl+G" desc="Generate theme" />
          <KbdRow keys="Ctrl+Enter" desc="Submit form" />
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-[var(--color-text)] mb-2">Output</h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Generates a valid WordPress Block Theme with theme.json, templates, patterns, and parts. Uses only standard core blocks — no Custom HTML blocks.
        </p>
      </div>
    </div>
  );
}

function KbdRow({ keys, desc }: { keys: string; desc: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[var(--color-text-secondary)]">{desc}</span>
      <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-hover)] border border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-muted)]">{keys}</kbd>
    </div>
  );
}

function NavBtn({ active, onClick, icon, children, badge }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode; badge?: number }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-[13px] transition-all ${active ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-medium' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'}`}>
      <span className={active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}>{icon}</span>
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto text-[9px] font-bold bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
    </button>
  );
}

function FolderIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>; }
function CogIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function HelpIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>; }
