import React from 'react';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PendingApproval: React.FC = () => {
  const { currentUser, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center dot-grid">
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="bg-bg-sidebar border border-border rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center">

          {/* Icon */}
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
            <Clock size={28} className="text-amber-500" />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h1 className="font-display font-bold text-xl text-text-main">
              Oczekiwanie na zatwierdzenie
            </h1>
            <p className="text-sm text-text-muted leading-relaxed">
              Twoje konto zostało utworzone i oczekuje na zatwierdzenie przez administratora.
              Zostaniesz powiadomiony/a po przyznaniu dostępu.
            </p>
          </div>

          {/* User info */}
          {currentUser && (
            <div className="w-full flex items-center gap-3 px-4 py-3 bg-bg-dark border border-border rounded-xl">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="avatar"
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-tr from-slate-600 to-slate-700 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0">
                  {currentUser.firstName[0]}{currentUser.lastName[0]}
                </div>
              )}
              <div className="text-left min-w-0">
                <p className="text-sm font-semibold text-text-main truncate">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-xs text-text-muted truncate">{currentUser.email}</p>
              </div>
            </div>
          )}

          <div className="w-full h-px bg-border" />

          <button
            onClick={logoutUser}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-danger transition-colors"
          >
            <LogOut size={15} />
            Wyloguj się
          </button>
        </div>
      </div>
    </div>
  );
};
