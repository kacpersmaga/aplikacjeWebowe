import { useState, useEffect } from 'react'
import './App.css'
import type { Project } from './types'
import { projectService } from './services/projectService'

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = () => {
    setProjects(projectService.getAll())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !description) return

    if (editingId) {
      projectService.update(editingId, { name, description })
      setEditingId(null)
    } else {
      projectService.create({ name, description })
    }

    setName('')
    setDescription('')
    loadProjects()
  }

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setName(project.name)
    setDescription(project.description)
  }

  const handleDelete = (id: string) => {
    projectService.delete(id)
    loadProjects()
  }

  const handleCancel = () => {
    setEditingId(null)
    setName('')
    setDescription('')
  }

  return (
    <div className="container">
      <h1>ManageMe - Projects</h1>
      
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label>Project Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter project name"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Enter project description"
          />
        </div>
        <div className="button-group">
          <button type="submit">{editingId ? 'Update' : 'Add'} Project</button>
          {editingId && <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>}
        </div>
      </form>

      <div className="project-list">
        <h2>Existing Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <div className="grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="actions">
                  <button onClick={() => handleEdit(project)}>Edit</button>
                  <button onClick={() => handleDelete(project.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
