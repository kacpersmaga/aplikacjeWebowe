import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { PriorityBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Notification } from '../../types';

/* ── Detail view ────────────────────────────────────────────── */
const NotificationDetail: React.FC<{
  notificationId: string;
  onBack: () => void;
}> = ({ notificationId, onBack }) => {
  const { notifications, markAsRead } = useNotifications();
  const notification = notifications.find(n => n.id === notificationId);

  // Mark as read automatically on entering detail view
  useEffect(() => {
    if (notification && !notification.isRead) {
      markAsRead(notification.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationId]);

  if (!notification) {
    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-text-main text-sm transition-colors w-fit">
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

/* ── List view ──────────────────────────────────────────────── */
export const NotificationList: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (n: Notification) => {
    setSelectedId(n.id);
  };

  if (selectedId) {
    return (
      <NotificationDetail
        notificationId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-text-main tracking-tight">Powiadomienia</h2>
            <p className="text-sm text-text-muted mt-0.5">
              {unreadCount > 0
                ? <><span className="text-primary font-semibold">{unreadCount}</span> nieprzeczytanych</>
                : 'Wszystkie przeczytane'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            icon={<CheckCheck size={15} />}
            onClick={markAllAsRead}
          >
            Oznacz wszystkie
          </Button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center animate-fade-in">
          <div className="p-8 bg-bg-sidebar border border-dashed border-border rounded-3xl opacity-40">
            <Bell size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-text-main">Brak powiadomień</h3>
            <p className="text-sm text-text-muted">Tutaj pojawią się Twoje powiadomienia.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map(n => (
            <button
              key={n.id}
              onClick={() => handleSelect(n)}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all
                hover:border-primary/30 hover:bg-primary/5 group
                ${n.isRead
                  ? 'bg-bg-sidebar border-border'
                  : 'bg-bg-sidebar border-border ring-1 ring-primary/15'}
              `}
            >
              {/* Unread indicator */}
              <div className="mt-1.5 shrink-0 w-2 h-2">
                {!n.isRead && <span className="w-2 h-2 bg-primary rounded-full block" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-sm font-semibold ${n.isRead ? 'text-text-muted' : 'text-text-main'}`}>
                    {n.title}
                  </span>
                  <PriorityBadge priority={n.priority} />
                </div>
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{n.message}</p>
                <p className="text-[11px] text-text-muted/50 mt-1.5 font-mono">
                  {new Date(n.date).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 mt-1">
                {!n.isRead && (
                  <button
                    onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                    title="Oznacz jako przeczytane"
                    className="opacity-0 group-hover:opacity-100 text-[11px] text-primary hover:underline underline-offset-2 transition-all whitespace-nowrap"
                  >
                    Przeczytane
                  </button>
                )}
                <ChevronRight size={15} className="text-text-muted/40 group-hover:text-text-muted transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
