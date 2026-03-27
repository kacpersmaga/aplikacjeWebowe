import React from 'react';
import type { Task, Story } from '../types';
import { useTasks } from '../context/TaskContext';
import { userService } from '../services/userService';
import {
  X, User, Calendar, Clock, Flag, CheckCircle2, AlertCircle, UserCheck
} from 'lucide-react';

interface TaskDetailProps {
  task: Task;
  story: Story;
  onClose: () => void;
}

const PRIORITY_LABELS: Record<string, string> = { low: 'Niski', medium: 'Średni', high: 'Wysoki' };
const STATUS_LABELS: Record<string, string> = { todo: 'Do zrobienia', doing: 'W trakcie', done: 'Zakończone' };

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-danger bg-danger/10 border-danger/20';
    case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    default: return 'text-success bg-success/10 border-success/20';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'done': return 'text-success bg-success/10 border-success/20';
    case 'doing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
};

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, story, onClose }) => {
  const { assignUser, completeTask } = useTasks();
  const assignableUsers = userService.getAssignableUsers();
  const assignedUser = task.assignedUserId ? userService.getUserById(task.assignedUserId) : undefined;

  const handleAssign = (userId: string) => {
    assignUser(task.id, userId);
  };

  const handleComplete = () => {
    completeTask(task.id);
    onClose();
  };

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-bg-sidebar p-8 rounded-[2rem] border border-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-text-muted hover:text-text-main transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8 pb-6 border-b border-border">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary ring-1 ring-primary/20 shrink-0">
            <Flag size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-text-main tracking-tight break-words">{task.name}</h2>
            <p className="text-text-muted text-sm font-medium mt-1">
              Historyjka: <span className="text-primary">{story.name}</span>
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(task.status)}`}>
            {STATUS_LABELS[task.status]}
          </span>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-2">Opis</p>
          <p className="text-text-main font-medium leading-relaxed bg-bg-dark rounded-xl p-4 border border-border/50">
            {task.description}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-dark rounded-xl p-4 border border-border/50 flex items-start gap-3">
            <Calendar size={16} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Data dodania</p>
              <p className="text-sm font-bold text-text-main mt-1">{formatDate(task.createdAt)}</p>
            </div>
          </div>
          <div className="bg-bg-dark rounded-xl p-4 border border-border/50 flex items-start gap-3">
            <Clock size={16} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Szacowany czas</p>
              <p className="text-sm font-bold text-text-main mt-1">{task.estimatedTime} h</p>
            </div>
          </div>
          <div className="bg-bg-dark rounded-xl p-4 border border-border/50 flex items-start gap-3">
            <Calendar size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Data startu</p>
              <p className="text-sm font-bold text-text-main mt-1">{formatDate(task.startDate)}</p>
            </div>
          </div>
          <div className="bg-bg-dark rounded-xl p-4 border border-border/50 flex items-start gap-3">
            <Calendar size={16} className="text-success mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Data zakończenia</p>
              <p className="text-sm font-bold text-text-main mt-1">{formatDate(task.endDate)}</p>
            </div>
          </div>
        </div>

        {/* Assigned User */}
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-3">Przypisana osoba</p>
          {assignedUser ? (
            <div className="flex items-center gap-3 bg-bg-dark rounded-xl p-4 border border-border/50">
              <div className="w-10 h-10 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-2 border-border rounded-xl flex items-center justify-center font-black text-sm text-text-main">
                {assignedUser.firstName[0]}{assignedUser.lastName[0]}
              </div>
              <div>
                <p className="font-bold text-text-main">{assignedUser.firstName} {assignedUser.lastName}</p>
                <p className="text-xs text-text-muted uppercase tracking-widest font-bold">{assignedUser.role}</p>
              </div>
              <UserCheck size={16} className="text-success ml-auto" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-text-muted bg-bg-dark rounded-xl p-4 border border-dashed border-border">
              <User size={16} />
              <span className="text-sm font-medium">Brak przypisanej osoby</span>
            </div>
          )}
        </div>

        {/* Assign User - only when not done */}
        {task.status !== 'done' && (
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-3">
              {task.assignedUserId ? 'Zmień przypisanie' : 'Przypisz osobę'}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {assignableUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleAssign(u.id)}
                  disabled={u.id === task.assignedUserId}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                    ${u.id === task.assignedUserId
                      ? 'border-primary/40 bg-primary/10 cursor-default'
                      : 'border-border hover:border-primary/50 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer'
                    }`}
                >
                  <div className="w-9 h-9 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-border rounded-lg flex items-center justify-center font-black text-xs text-text-main shrink-0">
                    {u.firstName[0]}{u.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-text-main text-sm">{u.firstName} {u.lastName}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">{u.role}</p>
                  </div>
                  {u.id === task.assignedUserId && (
                    <CheckCircle2 size={16} className="text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Complete button */}
        {task.status === 'doing' && (
          <div className="pt-6 border-t border-border">
            <button
              onClick={handleComplete}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-success hover:bg-success/80 text-white font-black rounded-2xl shadow-xl shadow-success/20 active:scale-95 transition-all"
            >
              <CheckCircle2 size={22} className="stroke-[2.5px]" />
              Oznacz jako Zakończone
            </button>
          </div>
        )}

        {task.status === 'todo' && !task.assignedUserId && (
          <div className="pt-6 border-t border-border">
            <div className="flex items-center gap-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
              <AlertCircle size={16} />
              <p className="text-sm font-bold">Przypisz osobę, aby zmienić stan na "W trakcie"</p>
            </div>
          </div>
        )}

        {task.status === 'done' && (
          <div className="pt-6 border-t border-border">
            <div className="flex items-center gap-2 p-4 bg-success/10 border border-success/20 rounded-xl text-success">
              <CheckCircle2 size={16} />
              <p className="text-sm font-bold">Zadanie zakończone</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
