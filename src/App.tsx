import React, { useState } from 'react'
import './App.css'
import { ProjectProvider, ProjectContext } from './context/ProjectContext'
import { StoryProvider } from './context/StoryContext'
import { ProjectList } from './components/ProjectList'
import { StoryList } from './components/StoryList'
import { userService } from './services/userService'
import { Layout, Users, List, Home, ChevronRight, Menu, Bell, Search, Settings } from 'lucide-react'

const AppContent: React.FC = () => {
  const user = userService.getCurrentUser();
  const [view, setView] = useState<'projects' | 'stories'>('projects');

  return (
    <StoryProvider>
      <div className="flex flex-col min-h-screen bg-bg-dark text-text-main antialiased selection:bg-primary/30 selection:text-white transition-colors duration-500">
        {/* Top Navbar */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-20 bg-bg-sidebar/80 backdrop-blur-2xl border-b border-border shadow-2xl">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-indigo-500 to-purple-600 rounded-[14px] flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-primary/20 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 ring-2 ring-white/10">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">Manage<span className="text-primary group-hover:text-white">Me</span></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-text-muted opacity-60">Professional Edition</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-bg-dark/50 border border-border rounded-xl text-text-muted hover:border-primary/50 transition-all group cursor-pointer">
              <Search size={18} className="group-hover:text-primary transition-colors" />
              <span className="text-sm font-bold">Wyszukiwarka globalna...</span>
              <span className="ml-4 px-1.5 py-0.5 bg-border rounded text-[10px] font-black">⌘K</span>
            </div>

            <div className="flex items-center gap-4 border-l border-border pl-8">
              <button className="relative p-2.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                <Bell size={22} />
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full border-2 border-bg-sidebar ring-2 ring-danger/20" />
              </button>
              <div className="flex items-center gap-4 group cursor-pointer p-1 rounded-2xl hover:bg-white/5 transition-all">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black tracking-tight">{user.firstName} {user.lastName}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-primary">Senior Developer</span>
                </div>
                <div className="w-11 h-11 bg-gradient-to-tr from-slate-700 to-slate-800 border-2 border-border rounded-xl flex items-center justify-center font-black text-sm text-text-main shadow-lg group-hover:border-primary group-hover:rotate-3 transition-all">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex flex-1 h-[calc(100vh-80px)] overflow-hidden">
          {/* Sidebar */}
          <aside className="w-72 bg-bg-sidebar/50 border-r border-border p-8 flex flex-col justify-between backdrop-blur-xl">
            <div className="space-y-10">
              <div className="space-y-3">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Główne Menu</p>
                <div className="flex flex-col gap-1.5">
                  <button 
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group
                      ${view === 'projects' 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 ring-1 ring-white/20' 
                        : 'text-text-muted hover:bg-white/5 hover:text-text-main'}`}
                    onClick={() => setView('projects')}
                  >
                    <Home size={20} className={`transition-transform duration-300 ${view === 'projects' ? 'scale-110' : 'group-hover:translate-x-1'}`} />
                    <span>Projekty</span>
                  </button>
                  <button 
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group
                      ${view === 'stories' 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 ring-1 ring-white/20' 
                        : 'text-text-muted hover:bg-white/5 hover:text-text-main'}`}
                    onClick={() => setView('stories')}
                  >
                    <List size={20} className={`transition-transform duration-300 ${view === 'stories' ? 'scale-110' : 'group-hover:translate-x-1'}`} />
                    <span>Historyjki</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Inne</p>
                <div className="flex flex-col gap-1.5 opacity-50 cursor-not-allowed">
                  <button className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-text-muted">
                    <Users size={20} />
                    <span>Zespół</span>
                  </button>
                  <button className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-text-muted">
                    <Settings size={20} />
                    <span>Ustawienia</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[2rem] space-y-4 shadow-inner">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <Bell size={20} className="animate-bounce" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-text-main">Wsparcie Techniczne</p>
                <p className="text-[10px] font-medium text-text-muted leading-relaxed">Potrzebujesz pomocy? Nasz zespół jest dostępny 24/7.</p>
              </div>
              <button className="w-full py-2.5 bg-bg-sidebar/50 hover:bg-white/5 rounded-xl border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary transition-all">Skontaktuj się</button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <ProjectContext.Consumer>
              {(context) => {
                if (!context) return null;
                const { activeProjectId, projects } = context;
                const activeProject = projects.find(p => p.id === activeProjectId);

                return (
                  <div className="p-10 max-w-[1600px] mx-auto min-h-full flex flex-col">
                    <header className="flex items-center gap-3 mb-12 bg-bg-sidebar/30 w-fit px-5 py-2.5 rounded-2xl border border-border shadow-lg">
                      <span className="text-sm font-bold text-text-muted">Panel Sterowania</span>
                      <ChevronRight size={16} className="text-border" />
                      <span className={`text-sm font-black uppercase tracking-widest ${view === 'projects' ? 'text-primary' : 'text-text-muted'}`}>
                        {view === 'projects' ? 'Przegląd Projektów' : 'Tablica Zadań'}
                      </span>
                      {activeProject && (
                        <>
                          <ChevronRight size={16} className="text-border" />
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                            <span className="text-sm font-black text-white bg-primary/20 px-3 py-1 rounded-lg border border-primary/30">{activeProject.name}</span>
                          </div>
                        </>
                      )}
                    </header>

                    <div className="flex-1">
                      {view === 'projects' && <ProjectList />}
                      {view === 'stories' && (
                        activeProjectId ? (
                          <StoryList />
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center py-32 bg-bg-sidebar/20 border border-dashed border-border rounded-[3rem] gap-8 text-center animate-fade-in group">
                            <div className="relative">
                              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:scale-200 transition-transform duration-700" />
                              <div className="relative p-12 bg-bg-sidebar rounded-full shadow-2xl border border-border">
                                <Layout size={100} className="text-border group-hover:text-primary transition-colors duration-500" />
                              </div>
                            </div>
                            <div className="space-y-3 max-w-md relative z-10">
                              <h2 className="text-4xl font-black text-text-main tracking-tight italic">Nie wybrano projektu</h2>
                              <p className="text-text-muted font-medium text-lg leading-relaxed">
                                Tablica zadań wymaga kontekstu. Wybierz jeden z aktywnych projektów, aby zarządzać jego funkcjonalnościami.
                              </p>
                            </div>
                            <button 
                              className="flex items-center gap-3 px-12 py-5 bg-primary hover:bg-primary-hover text-white font-black text-lg rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group relative overflow-hidden"
                              onClick={() => setView('projects')}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                              <Home size={24} className="stroke-[3px]" />
                              <span>Wróć do listy projektów</span>
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
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
