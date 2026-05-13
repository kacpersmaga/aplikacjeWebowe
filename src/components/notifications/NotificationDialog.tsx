import React, { useEffect } from 'react';
import { X, Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { PriorityBadge } from '../ui/Badge';

const PRIORITY_COLORS: Record<string, { border: string; icon: string; bar: string }> = {
  high: {
    border: 'border-red-500/40',
    icon: 'bg-red-500/10 text-red-500',
    bar: 'bg-red-500',
  },
  medium: {
    border: 'border-amber-400/40',
    icon: 'bg-amber-400/10 text-amber-500',
    bar: 'bg-amber-400',
  },
};

export const NotificationDialog: React.FC = () => {
  const { dialogQueue, dismissDialog, markAsRead } = useNotifications();
  const current = dialogQueue[0];

  // Auto-dismiss after 6 seconds (without marking as read)
  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => dismissDialog(), 6000);
    return () => clearTimeout(timer);
  }, [current?.id, dismissDialog]);

  if (!current) return null;

  const colors = PRIORITY_COLORS[current.priority] ?? PRIORITY_COLORS.medium;

  const handleMarkRead = () => {
    markAsRead(current.id);
    dismissDialog();
  };

  const handleDismiss = () => {
    dismissDialog();
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] w-80 animate-fade-in">
      <div className={`bg-bg-sidebar border ${colors.border} rounded-xl shadow-2xl overflow-hidden`}>
        <div className={`h-1 ${colors.bar}`} />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-1.5 rounded-lg shrink-0 ${colors.icon}`}>
              <Bell size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold text-text-main">{current.title}</span>
                <PriorityBadge priority={current.priority} />
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{current.message}</p>
              <button
                onClick={handleMarkRead}
                className="mt-2 flex items-center gap-1 text-[11px] text-primary hover:underline underline-offset-2 transition-colors"
              >
                <CheckCheck size={11} />
                Oznacz jako przeczytane
              </button>
            </div>
            <button
              onClick={handleDismiss}
              title="Zamknij"
              className="p-1 text-text-muted hover:text-text-main rounded transition-colors shrink-0"
            >
              <X size={13} />
            </button>
          </div>
          {dialogQueue.length > 1 && (
            <p className="text-[10px] text-text-muted/60 mt-2.5 text-center border-t border-border pt-2">
              +{dialogQueue.length - 1} kolejnych powiadomień
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
