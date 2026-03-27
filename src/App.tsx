import React, { useState } from 'react'
import './App.css'
import { ProjectProvider, ProjectContext } from './context/ProjectContext'
import { StoryProvider, useStories } from './context/StoryContext'
import { TaskProvider } from './context/TaskContext'
import { ProjectList } from './components/ProjectList'
import { StoryList } from './components/StoryList'
import { TaskBoard } from './components/TaskBoard'
import { userService } from './services/userService'
import { useDarkMode } from './hooks/useDarkMode'
import {
  LayoutDashboard, List, ListTodo, Users, Settings,
  Bell, Search, Sun, Moon, ChevronRight, FolderKanban,
} from 'lucide-react'

type View = 'projects' | 'stories' | 'tasks'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  developer: 'Developer',
  devops: 'DevOps',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-violet-500',
  developer: 'text-sky-500',
  devops: 'text-emerald-500',
}

const TasksView: React.FC<{ storyId: string; onBack: () => void }> = ({ storyId, onBack }) => {
  const { stories, loadStories } = useStories()
  const story = stories.find(s => s.id === storyId)
  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-text-muted">Nie znaleziono historyjki.</p>
        <button onClick={onBack} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium">Wróć</button>
      </div>
    )
  }
  return (
    <TaskProvider storyId={storyId} onStoryStatusChange={loadStories}>
      <TaskBoard story={story} />
    </TaskProvider>
  )
}

const AppContent: React.FC = () => {
  const user = userService.getCurrentUser()
  const [view, setView] = useState<View>('projects')
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null)
  const { isDark, toggle } = useDarkMode()

  const handleSelectStory = (storyId: string) => { setActiveStoryId(storyId); setView('tasks') }
  const handleBack = () => { setView('stories'); setActiveStoryId(null) }

  const navItems = [
    { id: 'projects' as View, label: 'Projekty', icon: <LayoutDashboard size={17} /> },
    { id: 'stories' as View, label: 'Historyjki', icon: <List size={17} /> },
    { id: 'tasks' as View, label: 'Zadania', icon: <ListTodo size={17} />, disabled: !activeStoryId },
  ]

  return (
    <StoryProvider>
      <div className="flex flex-col min-h-screen bg-bg-dark text-text-main transition-colors duration-300">

        {/* ── Navbar ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 h-14 flex items-center gap-6 px-6 bg-bg-sidebar/90 backdrop-blur-xl border-b border-border">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-violet-600 rounded-lg flex items-center justify-center font-display font-black text-base text-white shadow-md shadow-primary/30">
              M
            </div>
            <span className="font-display font-bold text-base text-text-main tracking-tight">
              Manage<span className="text-primary">Me</span>
            </span>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-border shrink-0" />

          {/* Nav items (inline in header on large screens) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => !item.disabled && setView(item.id)}
                disabled={item.disabled}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${view === item.id
                    ? 'bg-primary/10 text-primary'
                    : item.disabled
                    ? 'text-text-muted/30 cursor-not-allowed'
                    : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            {/* Global search */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-bg-dark border border-border rounded-xl text-sm text-text-muted hover:border-primary/40 transition-colors cursor-pointer group">
              <Search size={13} className="group-hover:text-primary transition-colors" />
              <span className="font-sans text-xs">Szukaj...</span>
              <kbd className="ml-4 px-1.5 py-0.5 bg-border/60 rounded text-[10px] font-mono opacity-60">⌘K</kbd>
            </div>

            {/* Dark mode */}
            <button
              onClick={toggle}
              title={isDark ? 'Tryb jasny' : 'Tryb ciemny'}
              className="p-2 text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full ring-2 ring-bg-sidebar" />
            </button>

            {/* User */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-border">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-semibold text-text-main leading-none">{user.firstName} {user.lastName}</p>
                <p className={`text-[10px] font-mono mt-0.5 ${ROLE_COLORS[user.role] ?? 'text-primary'}`}>
                  {ROLE_LABELS[user.role]}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-border rounded-lg flex items-center justify-center font-bold text-xs text-text-main shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            </div>
          </div>
        </header>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">

          {/* Sidebar */}
          <aside className="w-56 shrink-0 border-r border-border bg-bg-sidebar flex flex-col py-5 overflow-y-auto">
            <div className="px-3 space-y-0.5">
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">Nawigacja</p>
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => !item.disabled && setView(item.id)}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${view === item.id
                      ? 'bg-primary text-white shadow-sm shadow-primary/30'
                      : item.disabled
                      ? 'text-text-muted/30 cursor-not-allowed'
                      : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-6 px-3 space-y-0.5">
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">Narzędzia</p>
              {[
                { label: 'Zespół', icon: <Users size={17} /> },
                { label: 'Ustawienia', icon: <Settings size={17} /> },
              ].map(item => (
                <button
                  key={item.label}
                  disabled
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted/30 cursor-not-allowed"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Current project indicator */}
            <ProjectContext.Consumer>
              {(ctx) => {
                if (!ctx) return null
                const activeProject = ctx.projects.find(p => p.id === ctx.activeProjectId)
                if (!activeProject) return null
                return (
                  <div className="mx-3 p-3 rounded-xl bg-primary/8 border border-primary/20 mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/70 mb-1">Aktywny projekt</p>
                    <p className="text-xs font-semibold text-text-main truncate flex items-center gap-1.5">
                      <FolderKanban size={11} className="text-primary shrink-0" />
                      {activeProject.name}
                    </p>
                  </div>
                )
              }}
            </ProjectContext.Consumer>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto dot-grid">
            <ProjectContext.Consumer>
              {(ctx) => {
                if (!ctx) return null
                const { activeProjectId, projects } = ctx
                const activeProject = projects.find(p => p.id === activeProjectId)

                return (
                  <div className="px-8 py-8 max-w-[1400px] mx-auto min-h-full flex flex-col">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 mb-8 text-xs text-text-muted select-none">
                      <span className="font-medium">ManageMe</span>
                      <ChevronRight size={13} className="opacity-40" />
                      <span className={`font-semibold ${view === 'projects' ? 'text-text-main' : ''}`}>
                        {view === 'projects' ? 'Projekty' : view === 'stories' ? 'Historyjki' : 'Zadania'}
                      </span>
                      {activeProject && view !== 'projects' && (
                        <>
                          <ChevronRight size={13} className="opacity-40" />
                          <button
                            onClick={() => setView('stories')}
                            className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
                          >
                            {activeProject.name}
                          </button>
                        </>
                      )}
                      {view === 'tasks' && activeStoryId && (
                        <>
                          <ChevronRight size={13} className="opacity-40" />
                          <span className="font-semibold text-text-main">Zadania</span>
                        </>
                      )}
                    </nav>

                    {/* Content */}
                    <div className="flex-1">
                      {view === 'projects' && <ProjectList />}
                      {view === 'stories' && (
                        activeProjectId
                          ? <StoryList onSelectStory={handleSelectStory} />
                          : (
                            <div className="flex flex-col items-center justify-center py-28 gap-6 text-center animate-fade-in">
                              <div className="p-8 bg-bg-sidebar border border-dashed border-border rounded-3xl opacity-40">
                                <LayoutDashboard size={56} />
                              </div>
                              <div className="space-y-2 max-w-sm">
                                <h2 className="font-display text-2xl font-bold text-text-main">Brak aktywnego projektu</h2>
                                <p className="text-sm text-text-muted leading-relaxed">
                                  Wybierz projekt z listy, aby zarządzać jego historyjkami.
                                </p>
                              </div>
                              <button
                                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                                onClick={() => setView('projects')}
                              >
                                Przejdź do projektów
                              </button>
                            </div>
                          )
                      )}
                      {view === 'tasks' && activeStoryId && (
                        <TasksView storyId={activeStoryId} onBack={handleBack} />
                      )}
                    </div>
                  </div>
                )
              }}
            </ProjectContext.Consumer>
          </main>
        </div>
      </div>
    </StoryProvider>
  )
}

function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  )
}

export default App
