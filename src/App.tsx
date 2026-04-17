import React, { useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ProjectProvider, ProjectContext } from './context/ProjectContext'
import { StoryProvider, useStories } from './context/StoryContext'
import { TaskProvider } from './context/TaskContext'
import { ProjectList } from './components/ProjectList'
import { StoryList } from './components/StoryList'
import { TaskBoard } from './components/TaskBoard'
import { NotificationBell } from './components/notifications/NotificationBell'
import { NotificationDialog } from './components/notifications/NotificationDialog'
import { NotificationList } from './components/notifications/NotificationList'
import { LoginPage } from './components/LoginPage'
import { PendingApproval } from './components/PendingApproval'
import { UserList } from './components/UserList'
import { useDarkMode } from './hooks/useDarkMode'
import {
  LayoutDashboard, List, ListTodo, Bell, Search, Sun, Moon,
  ChevronRight, FolderKanban, Users, LogOut, Shield,
} from 'lucide-react'

type View = 'projects' | 'stories' | 'tasks' | 'notifications' | 'users'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  developer: 'Developer',
  devops: 'DevOps',
  guest: 'Gość',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-violet-500',
  developer: 'text-sky-500',
  devops: 'text-emerald-500',
  guest: 'text-amber-500',
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
  const { currentUser, logoutUser } = useAuth()
  const [view, setView] = useState<View>('projects')
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null)
  const { isDark, toggle } = useDarkMode()

  const handleSelectStory = (storyId: string) => { setActiveStoryId(storyId); setView('tasks') }
  const handleBack = () => { setView('stories'); setActiveStoryId(null) }

  const isAdmin = currentUser?.role === 'admin'

  const navItems = [
    { id: 'projects' as View, label: 'Projekty', icon: <LayoutDashboard size={17} /> },
    { id: 'stories' as View, label: 'Historyjki', icon: <List size={17} /> },
    { id: 'tasks' as View, label: 'Zadania', icon: <ListTodo size={17} />, disabled: !activeStoryId },
    { id: 'notifications' as View, label: 'Powiadomienia', icon: <Bell size={17} /> },
  ]

  const VIEW_LABELS: Record<View, string> = {
    projects: 'Projekty',
    stories: 'Historyjki',
    tasks: 'Zadania',
    notifications: 'Powiadomienia',
    users: 'Użytkownicy',
  }

  if (!currentUser) return null

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

          {/* Nav items */}
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

            {/* Notifications bell */}
            <NotificationBell onClick={() => setView('notifications')} />

            {/* User */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-border">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-semibold text-text-main leading-none">{currentUser.firstName} {currentUser.lastName}</p>
                <p className={`text-[10px] font-mono mt-0.5 ${ROLE_COLORS[currentUser.role] ?? 'text-primary'}`}>
                  {ROLE_LABELS[currentUser.role]}
                </p>
              </div>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="avatar" className="w-8 h-8 rounded-lg object-cover shrink-0 border border-border" />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-border rounded-lg flex items-center justify-center font-bold text-xs text-text-main shrink-0">
                  {currentUser.firstName[0]}{currentUser.lastName[0]}
                </div>
              )}
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

            {/* Admin tools */}
            {isAdmin && (
              <div className="mt-6 px-3 space-y-0.5">
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">Administracja</p>
                <button
                  onClick={() => setView('users')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${view === 'users'
                      ? 'bg-primary text-white shadow-sm shadow-primary/30'
                      : 'text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                >
                  <Users size={17} />
                  Użytkownicy
                </button>
              </div>
            )}

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

            {/* Logout */}
            <div className="px-3 mt-3">
              <button
                onClick={logoutUser}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/5 transition-all"
              >
                <LogOut size={17} />
                Wyloguj się
              </button>
            </div>
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
                      <span className={`font-semibold ${view === 'projects' || view === 'notifications' || view === 'users' ? 'text-text-main' : ''}`}>
                        {VIEW_LABELS[view]}
                      </span>
                      {activeProject && view !== 'projects' && view !== 'notifications' && view !== 'users' && (
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
                      {view === 'notifications' && <NotificationList />}
                      {view === 'users' && isAdmin && <UserList />}
                      {view === 'users' && !isAdmin && (
                        <div className="flex flex-col items-center justify-center py-28 gap-4">
                          <Shield size={40} className="text-text-muted/30" />
                          <p className="text-text-muted text-sm">Brak dostępu.</p>
                        </div>
                      )}
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

        {/* Notification toast dialog */}
        <NotificationDialog />
      </div>
    </StoryProvider>
  )
}

const AuthGate: React.FC = () => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center font-display font-black text-lg text-white animate-pulse">
            M
          </div>
          <p className="text-sm text-text-muted">Ładowanie...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) return <LoginPage />
  if (currentUser.blocked) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center dot-grid">
        <div className="w-full max-w-sm mx-auto px-6">
          <div className="bg-bg-sidebar border border-danger/30 rounded-2xl p-8 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-danger/10 border border-danger/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🚫</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-text-main">Konto zablokowane</h2>
              <p className="text-sm text-text-muted mt-1">Twoje konto zostało zablokowane. Skontaktuj się z administratorem.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (currentUser.role === 'guest') return <PendingApproval />

  return (
    <NotificationProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </NotificationProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  )
}

export default App
