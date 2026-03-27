import React, { useState } from 'react';
import type { Task, Story, Status } from '../types';
import { useTasks } from '../context/TaskContext';
import { userService } from '../services/userService';
import { TaskForm } from './TaskForm';
import { TaskDetail } from './TaskDetail';
import { Edit2, Trash2, Plus, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';

interface TaskBoardProps {
  story: Story;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-danger bg-danger/10 border-danger/20';
    case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    default: return 'text-success bg-success/10 border-success/20';
  }
};

const PRIORITY_LABELS: Record<string, string> = { low: 'Niski', medium: 'Średni', high: 'Wysoki' };

export const TaskBoard: React.FC<TaskBoardProps> = ({ story }) => {
  const { tasks, deleteTask } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const tasksByStatus = (status: Status) => tasks.filter(t => t.status === status);

  const handleEdit = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteTask(id);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(undefined);
  };

  const renderTaskCard = (task: Task) => {
    const assignedUser = task.assignedUserId ? userService.getUserById(task.assignedUserId) : undefined;

    return (
      <div
        key={task.id}
        onClick={() => setSelectedTask(task)}
        className="group bg-bg-sidebar border border-border p-5 rounded-2xl transition-all duration-300 hover:border-primary/50 hover:bg-black/5 dark:hover:bg-white/5 hover:translate-x-1 shadow-lg cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {task.status === 'todo' && (
              <button
                onClick={(e) => handleEdit(e, task)}
                className="p-1.5 text-text-muted hover:text-primary transition-colors"
              >
                <Edit2 size={14} />
              </button>
            )}
            <button
              onClick={(e) => handleDelete(e, task.id)}
              className="p-1.5 text-text-muted hover:text-danger transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <h3 className="text-base font-bold text-text-main mb-1.5 leading-tight group-hover:text-primary transition-colors">
          {task.name}
        </h3>
        <p className="text-text-muted text-sm font-medium line-clamp-2 mb-4 leading-relaxed">
          {task.description}
        </p>

        <div className="flex items-center gap-3 mb-3 text-[11px] font-bold text-text-muted">
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-primary/60" />
            <span>{task.estimatedTime}h</span>
          </div>
          {task.status === 'done' && (
            <div className="flex items-center gap-1.5 text-success">
              <CheckCircle2 size={11} />
              <span>Gotowe</span>
            </div>
          )}
        </div>

        {assignedUser && (
          <div className="flex items-center gap-2 pt-3 border-t border-border/50">
            <div className="w-6 h-6 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-border rounded-md flex items-center justify-center font-black text-[10px] text-text-main">
              {assignedUser.firstName[0]}{assignedUser.lastName[0]}
            </div>
            <span className="text-[11px] font-bold text-text-muted">{assignedUser.firstName} {assignedUser.lastName}</span>
          </div>
        )}

        {!assignedUser && (
          <div className="flex items-center gap-2 pt-3 border-t border-border/50 text-text-muted opacity-40">
            <User size={12} />
            <span className="text-[11px] font-bold">Nieprzypisane</span>
          </div>
        )}

        {task.startDate && (
          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-text-muted">
            <Calendar size={10} className="text-amber-500/60" />
            <span>Start: {new Date(task.startDate).toLocaleDateString('pl-PL')}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-10 animate-fade-in pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-text-main tracking-tight">Zadania</h2>
          <p className="text-text-muted mt-1 font-medium italic">
            Historyjka: <span className="text-primary">{story.name}</span>
          </p>
        </div>
        <button
          className="flex items-center gap-3 px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus size={24} className="stroke-[3px]" />
          Dodaj Zadanie
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {(['todo', 'doing', 'done'] as Status[]).map((status) => (
          <div key={status} className="flex flex-col gap-5 bg-bg-sidebar/20 p-6 rounded-[2.5rem] border border-border/40 backdrop-blur-xl">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  status === 'todo' ? 'bg-slate-500' : status === 'doing' ? 'bg-amber-500' : 'bg-success'
                } shadow-lg ring-4 ring-opacity-20 ${
                  status === 'todo' ? 'ring-slate-500' : status === 'doing' ? 'ring-amber-500' : 'ring-success'
                }`} />
                <span className="text-sm font-black text-text-main uppercase tracking-[0.2em]">
                  {status === 'todo' ? 'Do zrobienia' : status === 'doing' ? 'W trakcie' : 'Gotowe'}
                </span>
              </div>
              <span className="px-2.5 py-1 bg-border/40 rounded-lg text-[10px] font-black text-text-muted">
                {tasksByStatus(status).length}
              </span>
            </div>

            <div className="flex flex-col gap-4 min-h-[300px]">
              {tasksByStatus(status).length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/30 rounded-3xl opacity-30 p-10 text-center grayscale">
                  <Clock size={48} className="mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Pusta Kolumna</p>
                </div>
              ) : (
                tasksByStatus(status).map(renderTaskCard)
              )}
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <TaskForm onClose={handleCloseForm} taskToEdit={taskToEdit} />
      )}

      {selectedTask && (
        <TaskDetail
          task={tasks.find(t => t.id === selectedTask.id) ?? selectedTask}
          story={story}
          onClose={() => setSelectedTask(undefined)}
        />
      )}
    </div>
  );
};
