'use client';

import { useState, useEffect } from 'react';
import { ThemeFiles } from '../types';

interface SavedProject { id: string; name: string; slug: string; timestamp: number; files: ThemeFiles; zipBase64: string; }
interface SidebarProps { currentResult: { files: ThemeFiles; themeSlug: string; zipBase64: string } | null; onLoadProject: (project: SavedProject) => void; onReset: () => void; }
type Panel = 'projects' | 'settings' | 'help' | null;

export function Sidebar({ currentResult, onLoadProject, onReset }: SidebarProps) {
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [projects, setProjects] = useState<SavedProject[]>(() => { try { const s = localStorage.getItem('wp-theme-projects'); return s ? JSON.parse(s) : []; } catch { return []; } });

  useEffect(() => {
    if (!currentResult) return;
    const existing = projects.find(p => p.slug === currentResult.themeSlug);
    if (existing) return;
    const project: SavedProject = { id: Date.now().toString(), name: currentResult.themeSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), slug: currentResult.themeSlug, timestamp: Date.now(), files: currentResult.files, zipBase64: currentResult.zipBase64 };
    const updated = [project, ...projects].slice(0, 10);
    setProjects(updated);
    try { localStorage.setItem('wp-theme-projects', JSON.stringify(updated)); } catch { /* quota */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResult?.themeSlug]);

  const togglePanel = (panel: Panel) => setActivePanel(prev => prev === panel ? null : panel);
  const deleteProject = (id: string) => { const u = projects.filter(p => p.id !== id); setProjects(u); try { localStorage.setItem('wp-theme-projects', JSON.stringify(u)); } catch {} };

  return (
    <aside className="w-60 shrink-0 h-full border-r border-[var(--color-border)]/10 bg-[var(--color-bg-sidebar)] flex flex-col relative">
      {/* Subtle blue gradient accent at top */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-primary-container)]/5 to-transparent pointer-events-none" />

      <div className="px-5 pt-5 pb-3 relative z-10">
        <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--color-primary-container)] mb-0.5">Workspace</div>
        <div className="text-[11px] text-[var(--color-text-muted)] font-mono">AI Block Theme</div>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5 px-2 relative z-10">
        <SideNavBtn active icon="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75" onClick={() => togglePanel(null)}>Generator</SideNavBtn>
        <SideNavBtn icon="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" onClick={() => togglePanel('projects')} badge={projects.length || undefined}>Projects</SideNavBtn>
        <SideNavBtn icon="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" onClick={() => togglePanel('settings')}>Settings</SideNavBtn>
        <SideNavBtn icon="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" onClick={() => togglePanel('help')}>Help</SideNavBtn>
      </nav>

      <div className="p-3 relative z-10">
        <button onClick={onReset} className="w-full py-3 bg-[var(--color-bg-muted)] border border-[var(--color-border)]/10 text-[var(--color-primary-container)] font-mono text-[10px] uppercase tracking-[0.15em] rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--color-primary-container)]/5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New Theme
        </button>
      </div>

      {/* Slide-out panel */}
      {activePanel && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setActivePanel(null)} />
          <div className="absolute left-60 top-0 bottom-0 w-72 bg-white border-r border-[var(--color-border)]/20 shadow-[var(--shadow-xl)] z-20 flex flex-col animate-[slideInRight_0.15s_ease-out]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]/10">
              <span className="text-sm font-semibold text-[var(--color-text)]">{activePanel === 'projects' ? 'Projects' : activePanel === 'settings' ? 'Settings' : 'Help'}</span>
              <button onClick={() => setActivePanel(null)} className="w-6 h-6 rounded flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-hover)] transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {activePanel === 'projects' && <ProjectsPanel projects={projects} onLoad={(p) => { onLoadProject(p); setActivePanel(null); }} onDelete={deleteProject} />}
              {activePanel === 'settings' && <SettingsPanel />}
              {activePanel === 'help' && <HelpPanel />}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

function SideNavBtn({ active, icon, onClick, children, badge }: { active?: boolean; icon: string; onClick: () => void; children: React.ReactNode; badge?: number }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-[11px] font-mono uppercase tracking-[0.12em] transition-all duration-150 ${active ? 'bg-[var(--color-primary-container)] text-white ring-2 ring-[var(--color-primary-container)]/20 shadow-sm' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:translate-x-0.5'}`}>
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
      {children}
      {badge !== undefined && badge > 0 && <span className="ml-auto text-[9px] bg-[var(--color-primary-container)]/10 text-[var(--color-primary-container)] px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
    </button>
  );
}

function ProjectsPanel({ projects, onLoad, onDelete }: { projects: SavedProject[]; onLoad: (p: SavedProject) => void; onDelete: (id: string) => void }) {
  if (projects.length === 0) return <p className="text-sm text-[var(--color-text-muted)] text-center py-8">No saved themes yet.</p>;
  return (
    <div className="space-y-2">
      {projects.map(p => (
        <div key={p.id} className="border border-[var(--color-border)]/10 rounded-lg p-3 hover:bg-[var(--color-bg-hover)] transition-colors group">
          <div className="flex items-start justify-between">
            <button onClick={() => onLoad(p)} className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text)] truncate">{p.name}</p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{Object.keys(p.files.templates).length} templates &middot; {Object.keys(p.files.patterns).length} patterns</p>
            </button>
            <button onClick={() => onDelete(p.id)} className="text-[var(--color-text-muted)] hover:text-[var(--color-error)] opacity-0 group-hover:opacity-100 transition-all p-1" title="Delete">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsPanel() {
  const [provider, setProvider] = useState(() => { try { return localStorage.getItem('wp-theme-provider') || 'auto'; } catch { return 'auto'; } });
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">AI Provider</label>
        <select value={provider} onChange={e => { setProvider(e.target.value); localStorage.setItem('wp-theme-provider', e.target.value); }} className="w-full px-3 py-2 bg-[var(--color-bg-input)] border border-[var(--color-border)]/20 rounded-lg text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]/20">
          <option value="auto">Auto</option><option value="anthropic">Anthropic</option><option value="openrouter">OpenRouter</option>
        </select>
      </div>
    </div>
  );
}

function HelpPanel() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-[var(--color-text)] mb-2">How it works</h3>
        <ol className="text-xs text-[var(--color-text-secondary)] space-y-1.5 list-decimal list-inside">
          <li>Describe your theme in natural language</li>
          <li>Optionally set colors, typography, and layout</li>
          <li>Click Generate — the AI builds a complete block theme</li>
          <li>Preview it live in WordPress Playground</li>
          <li>Download the .zip and install on any WordPress site</li>
        </ol>
      </div>
    </div>
  );
}
