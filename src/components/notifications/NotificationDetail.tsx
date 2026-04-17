import React, { useEffect } from 'react';
import { ArrowLeft, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { PriorityBadge } from '../ui/Badge';

interface NotificationDetailProps {
  notificationId: string;
  onBack: () => void;
}

export const NotificationDetail: React.FC<NotificationDetailProps> = ({ notificationId, onBack }) => {
  const { notifications, markAsRead } = useNotifications();
  const notification = notifications.find(n => n.id === notificationId);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id);
    }
    // Run only when notificationId changes, not on every markAsRead reference change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationId]);

  if (!notification) {
    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-main text-sm transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Wróć do powiadomień
        </button>
        <p className="text-text-muted text-sm">Nie znaleziono powiadomienia.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-text-muted hover:text-text-main text-sm transition-colors w-fit"
      >
        <ArrowLeft size={15} />
        Wróć do powiadomień
      </button>

      <div className="bg-bg-sidebar border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <PriorityBadge priority={notification.priority} />
          {notification.isRead ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-500">
              <CheckCheck size={12} />
              Przeczytane
            </span>
          ) : (
            <button
              onClick={() => markAsRead(notification.id)}
              className="flex items-center gap-1 text-[11px] text-primary hover:underline underline-offset-2 transition-colors"
            >
              <CheckCheck size={12} />
              Oznacz jako przeczytane
            </button>
          )}
        </div>

        <h2 className="font-display text-xl font-bold text-text-main mb-1.5">{notification.title}</h2>
        <p className="text-[11px] text-text-muted/60 font-mono mb-5">
          {new Date(notification.date).toLocaleString('pl-PL', { dateStyle: 'long', timeStyle: 'medium' })}
        </p>
        <p className="text-sm text-text-muted leading-relaxed">{notification.message}</p>
      </div>
    </div>
  );
};
