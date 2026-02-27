import './App.css'
import { ProjectProvider } from './context/ProjectContext'
import { ProjectList } from './components/ProjectList'

function App() {
  return (
    <ProjectProvider>
      <div className="app-container">
        <nav className="top-nav">
          <div className="logo-section">
            <div className="logo-circle">M</div>
            <span className="logo-text">Manage<span>Me</span></span>
          </div>
          <div className="nav-profile">
            <span className="profile-name">Kacper Smaga</span>
            <div className="profile-avatar">KS</div>
          </div>
        </nav>
        
        <ProjectList />
      </div>
    </ProjectProvider>
  )
}

export default App
