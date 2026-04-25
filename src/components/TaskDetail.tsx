import React, { useCallback, useState, useEffect } from 'react';
import type { Task, Story, User } from '../types';
import { useTasks } from '../context/TaskContext';
import { userService } from '../services/userService';
import { ROLE_LABELS } from '../constants/roles';
import { X, User, Calendar, Clock, Flag, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';
import { Modal } from './ui/Modal';
import { PriorityBadge, StatusBadge } from './ui/Badge';
import { Button } from './ui/Button';

interface TaskDetailProps {
  task: Task;
  story: Story;
  onClose: () => void;
}

const fmt = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, story, onClose }) => {
  const { assignUser, completeTask } = useTasks();
  const [assignableUsers, setAssignableUsers] = useState<User[]>([]);
  const [assignedUser, setAssignedUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    userService.getAssignableUsers().then(setAssignableUsers);
  }, []);

  useEffect(() => {
    if (task.assignedUserId) {
      userService.getUserById(task.assignedUserId).then(setAssignedUser);
    } else {
      setAssignedUser(undefined);
    }
  }, [task.assignedUserId]);

  const handleComplete = useCallback(() => {
    completeTask(task.id);
    onClose();
  }, [completeTask, task.id, onClose]);

  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-border">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5">
            <Flag size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-text-main leading-snug break-words">
              {task.name}
            </h2>
            <p className="text-xs text-text-muted mt-1">
              Historyjka: <span className="text-primary font-medium">{story.name}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors shrink-0 ml-4"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>

        {/* Description */}
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Opis</p>
          <p className="text-sm text-text-main leading-relaxed bg-bg-dark border border-border rounded-lg px-4 py-3">
            {task.description}
          </p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Calendar size={14} className="text-primary" />, label: 'Data dodania', value: fmt(task.createdAt) },
            { icon: <Clock size={14} className="text-primary" />, label: 'Szacowany czas', value: `${task.estimatedTime} h` },
            { icon: <Calendar size={14} className="text-amber-500" />, label: 'Data startu', value: fmt(task.startDate) },
            { icon: <Calendar size={14} className="text-emerald-500" />, label: 'Data zakończenia', value: fmt(task.endDate) },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-bg-dark border border-border rounded-lg p-3 flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">{icon}</div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
                <p className="text-sm font-mono font-medium text-text-main mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Assigned user */}
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Przypisana osoba</p>
          {assignedUser ? (
            <div className="flex items-center gap-3 bg-bg-dark border border-border rounded-lg px-4 py-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-border rounded-lg flex items-center justify-center font-bold text-sm text-text-main shrink-0">
                {assignedUser.firstName[0] ?? '?'}{assignedUser.lastName[0] ?? ''}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-main">
                  {assignedUser.firstName} {assignedUser.lastName}
                </p>
                <p className="text-[11px] text-text-muted">
                  {ROLE_LABELS[assignedUser.role] ?? assignedUser.role}
                </p>
              </div>
              <UserCheck size={14} className="text-emerald-500 shrink-0" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-text-muted bg-bg-dark border border-dashed border-border rounded-lg px-4 py-3">
              <User size={14} />
              <span className="text-sm">Brak przypisanej osoby</span>
            </div>
          )}
        </div>

        {/* Assign users */}
        {task.status !== 'done' && (
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              {task.assignedUserId ? 'Zmień przypisanie' : 'Przypisz osobę'}
            </p>
            <div className="flex flex-col gap-1.5">
              {assignableUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => assignUser(task.id, u.id)}
                  disabled={u.id === task.assignedUserId}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left
                    ${u.id === task.assignedUserId
                      ? 'border-primary/40 bg-primary/5 cursor-default'
                      : 'border-border hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-black/3 dark:hover:bg-white/5 cursor-pointer'
                    }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-border rounded-md flex items-center justify-center font-bold text-xs text-text-main shrink-0">
                    {u.firstName[0] ?? '?'}{u.lastName[0] ?? ''}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-main">{u.firstName} {u.lastName}</p>
                    <p className="text-[11px] text-text-muted">{ROLE_LABELS[u.role] ?? u.role}</p>
                  </div>
                  {u.id === task.assignedUserId && (
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {task.status === 'doing' && (
          <Button
            variant="primary"
            size="lg"
            icon={<CheckCircle2 size={16} />}
            onClick={handleComplete}
            className="w-full justify-center !bg-emerald-600 hover:!bg-emerald-700 !shadow-emerald-600/20"
          >
            Oznacz jako zakończone
          </Button>
        )}

        {task.status === 'todo' && !task.assignedUserId && (
          <div className="flex items-center gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400">
            <AlertCircle size={15} className="shrink-0" />
            <p className="text-sm font-medium">Przypisz osobę, aby zmienić stan na „W trakcie"</p>
          </div>
        )}

        {task.status === 'done' && (
          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 size={15} className="shrink-0" />
            <p className="text-sm font-medium">Zadanie zostało zakończone</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
