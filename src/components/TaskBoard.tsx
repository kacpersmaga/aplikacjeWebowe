import React, { useState } from 'react';
import type { Task, Story, Status } from '../types';
import { useTasks } from '../context/TaskContext';
import { userService } from '../services/userService';
import { TaskForm } from './TaskForm';
import { TaskDetail } from './TaskDetail';
import { KanbanColumn } from './KanbanColumn';
import { PriorityBadge } from './ui/Badge';
import { Button } from './ui/Button';
import { Edit2, Trash2, Clock, User, CheckCircle2, ListTodo, Plus, Calendar } from 'lucide-react';

const PRIORITY_ACCENT: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-400',
  low: 'bg-zinc-300 dark:bg-zinc-600',
};

interface TaskBoardProps {
  story: Story;
}

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

  const renderTaskCard = (task: Task) => {
    const assignedUser = task.assignedUserId ? userService.getUserById(task.assignedUserId) : undefined;

    return (
      <div
        key={task.id}
        onClick={() => setSelectedTask(task)}
        className="group relative bg-bg-sidebar border border-border rounded-xl overflow-hidden
          transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md cursor-pointer"
      >
        {/* Priority accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${PRIORITY_ACCENT[task.priority]}`} />

        <div className="pl-4 pr-3 py-3.5">
          {/* Top: badge + actions */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <PriorityBadge priority={task.priority} />
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {task.status === 'todo' && (
                <button
                  onClick={(e) => handleEdit(e, task)}
                  className="p-1.5 text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                >
                  <Edit2 size={13} />
                </button>
              )}
              <button
                onClick={(e) => handleDelete(e, task.id)}
                className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-text-main leading-snug mb-1.5 group-hover:text-primary transition-colors">
            {task.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-3">
            {task.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] font-mono text-text-muted/70">
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {task.estimatedTime}h
              </span>
              {task.status === 'done' && (
                <span className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 size={10} />
                  Gotowe
                </span>
              )}
              {task.startDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(task.startDate).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' })}
                </span>
              )}
            </div>

            {assignedUser ? (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-border rounded-md flex items-center justify-center text-[9px] font-bold text-text-main shrink-0">
                  {assignedUser.firstName[0]}{assignedUser.lastName[0]}
                </div>
                <span className="text-[11px] text-text-muted hidden sm:block">
                  {assignedUser.firstName}
                </span>
              </div>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-text-muted/40">
                <User size={10} />
                Brak
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
            <ListTodo size={24} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-text-main tracking-tight">Zadania</h2>
            <p className="text-sm text-text-muted mt-0.5">
              <span className="text-primary">{story.name}</span>
              {' · '}{tasks.length} {tasks.length === 1 ? 'zadanie' : 'zadań'}
            </p>
          </div>
        </div>
        <Button variant="primary" icon={<Plus size={15} />} onClick={() => setIsFormOpen(true)}>
          Dodaj zadanie
        </Button>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(['todo', 'doing', 'done'] as Status[]).map((status) => {
          const items = tasksByStatus(status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              count={items.length}
              emptyIcon={<ListTodo size={28} />}
              emptyText="Brak zadań"
            >
              {items.map(renderTaskCard)}
            </KanbanColumn>
          );
        })}
      </div>

      {isFormOpen && <TaskForm onClose={() => { setIsFormOpen(false); setTaskToEdit(undefined); }} taskToEdit={taskToEdit} />}
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
