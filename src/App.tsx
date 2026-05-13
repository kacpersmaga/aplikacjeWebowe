import React, { useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ProjectProvider } from './context/ProjectContext'
import { StoryProvider, useStories } from './context/StoryContext'
import { TaskProvider } from './context/TaskContext'
import { ProjectList } from './components/ProjectList'
import { StoryList } from './components/StoryList'
import { TaskBoard } from './components/TaskBoard'
import { NotificationDialog } from './components/notifications/NotificationDialog'
import { NotificationList } from './components/notifications/NotificationList'
import { LoginPage } from './components/LoginPage'
import { PendingApproval } from './components/PendingApproval'
import { UserList } from './components/UserList'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Navbar } from './components/layout/Navbar'
import { Sidebar } from './components/layout/Sidebar'
import { useDarkMode } from './hooks/useDarkMode'
import { LayoutDashboard, List, ListTodo, Bell, Shield, ChevronRight } from 'lucide-react'

type View = 'projects' | 'stories' | 'tasks' | 'notifications' | 'users'

const VIEW_LABELS: Record<View, string> = {
  projects: 'Projekty',
  stories: 'Historyjki',
  tasks: 'Zadania',
  notifications: 'Powiadomienia',
  users: 'Użytkownicy',
}

const TasksView: React.FC<{ storyId: string; onBack: () => void }> = ({ storyId, onBack }) => {
  const { stories, loadStories } = useStories()
  const story = stories.find(s => s.id === storyId)
  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-text-muted">Nie znaleziono historyjki.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium"
        >
          Wróć
        </button>
      </div>
    )
  }
  return (
    <TaskProvider storyId={storyId} onStoryStatusChange={loadStories}>
      <TaskBoard story={story} />
    </TaskProvider>
  )
}

const AppShell: React.FC = () => {
  const { currentUser, logoutUser } = useAuth()
  const [view, setView] = useState<View>('projects')
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null)
  const { isDark, toggle } = useDarkMode()

  const isAdmin = currentUser?.role === 'admin'

  const navItems = [
    { id: 'projects' as View, label: 'Projekty', icon: <LayoutDashboard size={17} /> },
    { id: 'stories' as View, label: 'Historyjki', icon: <List size={17} /> },
    { id: 'tasks' as View, label: 'Zadania', icon: <ListTodo size={17} />, disabled: !activeStoryId },
    { id: 'notifications' as View, label: 'Powiadomienia', icon: <Bell size={17} /> },
  ]

  const handleSelectStory = (storyId: string) => {
    setActiveStoryId(storyId)
    setView('tasks')
  }

  const handleBack = () => {
    setView('stories')
    setActiveStoryId(null)
  }

  if (!currentUser) return null

  return (
    <StoryProvider>
      <div className="flex flex-col min-h-screen bg-bg-dark text-text-main transition-colors duration-300">
        <Navbar
          currentUser={currentUser}
          view={view}
          navItems={navItems}
          isDark={isDark}
          onToggleDark={toggle}
          onSetView={setView}
          onNotificationsClick={() => setView('notifications')}
        />

        <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
          <Sidebar
            view={view}
            navItems={navItems}
            isAdmin={isAdmin}
            onSetView={setView}
            onLogout={logoutUser}
          />

          <main className="flex-1 overflow-y-auto dot-grid">
            <div className="px-8 py-8 max-w-[1400px] mx-auto min-h-full flex flex-col">
              <Breadcrumb view={view} activeStoryId={activeStoryId} onSetView={setView} />

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
                  <StoryList onSelectStory={handleSelectStory} />
                )}
                {view === 'tasks' && activeStoryId && (
                  <TasksView storyId={activeStoryId} onBack={handleBack} />
                )}
              </div>
            </div>
          </main>
        </div>

        <NotificationDialog />
      </div>
    </StoryProvider>
  )
}

interface BreadcrumbProps {
  view: View;
  activeStoryId: string | null;
  onSetView: (v: View) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ view, activeStoryId, onSetView }) => {
  const { stories } = useStories()
  const activeStory = stories.find(s => s.id === activeStoryId)

  return (
    <nav className="flex items-center gap-2 mb-8 text-xs text-text-muted select-none">
      <span className="font-medium">ManageMe</span>
      <ChevronRight size={13} className="opacity-40" />
      <span className={`font-semibold ${['projects', 'notifications', 'users'].includes(view) ? 'text-text-main' : ''}`}>
        {VIEW_LABELS[view]}
      </span>
      {view === 'tasks' && activeStory && (
        <>
          <ChevronRight size={13} className="opacity-40" />
          <button
            onClick={() => onSetView('stories')}
            className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
          >
            {activeStory.name}
          </button>
        </>
      )}
    </nav>
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
            <div className="w-14 h-14 bg-danger/10 border border-danger/20 rounded-2xl flex items-center justify-center text-2xl">
              🚫
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-text-main">Konto zablokowane</h2>
              <p className="text-sm text-text-muted mt-1">
                Twoje konto zostało zablokowane. Skontaktuj się z administratorem.
              </p>
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
        <AppShell />
      </ProjectProvider>
    </NotificationProvider>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
