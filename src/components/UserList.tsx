import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Ban, CheckCircle, ChevronDown } from 'lucide-react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS, ROLE_BADGE_COLORS } from '../constants/roles';
import type { User, Role } from '../types';
import { SUPER_ADMIN_EMAIL } from '../config';

const ALL_ROLES: Role[] = ['admin', 'developer', 'devops', 'guest'];

export const UserList: React.FC = () => {
  const { currentUser, refreshCurrentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  const reload = useCallback(() => {
    setUsers(userService.getAllUsers());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleRoleChange = (user: User, role: Role) => {
    userService.updateUserRole(user.id, role);
    if (currentUser?.id === user.id) refreshCurrentUser();
    reload();
  };

  const handleToggleBlock = (user: User) => {
    userService.setBlocked(user.id, !user.blocked);
    reload();
  };

  const isSuperAdmin = (user: User) =>
    Boolean(SUPER_ADMIN_EMAIL) && user.email === SUPER_ADMIN_EMAIL;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
          <Shield size={18} className="text-primary" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-text-main">Użytkownicy</h2>
          <p className="text-sm text-text-muted">
            {users.length} {users.length === 1 ? 'użytkownik' : 'użytkowników'} w systemie
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16 text-text-muted text-sm">Brak użytkowników w systemie.</div>
      ) : (
        <div className="bg-bg-sidebar border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Użytkownik</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">E-mail</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Rola</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => {
                const isCurrentUser = currentUser?.id === user.id;
                const superAdmin = isSuperAdmin(user);
                const canModify = !isCurrentUser && !superAdmin;

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${user.blocked ? 'opacity-50' : 'hover:bg-black/5 dark:hover:bg-white/[0.02]'}`}
                  >
                    {/* User */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-tr from-slate-600 to-slate-700 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0">
                            {user.firstName[0] ?? '?'}{user.lastName[0] ?? ''}
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-text-main">
                            {user.firstName} {user.lastName}
                          </span>
                          {isCurrentUser && (
                            <span className="ml-2 text-[10px] font-mono text-primary/70">(Ty)</span>
                          )}
                          {superAdmin && (
                            <span className="ml-2 text-[10px] font-mono text-violet-500/70">(Super Admin)</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-text-muted font-mono text-xs">{user.email}</td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      {canModify ? (
                        <div className="relative inline-flex items-center">
                          <select
                            value={user.role}
                            onChange={e => handleRoleChange(user, e.target.value as Role)}
                            className={`pl-2.5 pr-7 py-1 rounded-lg border text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${ROLE_BADGE_COLORS[user.role]} bg-transparent`}
                          >
                            {ALL_ROLES.map(r => (
                              <option key={r} value={r} className="bg-bg-sidebar text-text-main">
                                {ROLE_LABELS[r]}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={11} className="absolute right-2 pointer-events-none text-text-muted" />
                        </div>
                      ) : (
                        <span className={`inline-flex px-2.5 py-1 rounded-lg border text-xs font-semibold ${ROLE_BADGE_COLORS[user.role]}`}>
                          {ROLE_LABELS[user.role]}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.blocked ? 'text-danger' : 'text-success'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.blocked ? 'bg-danger' : 'bg-success'}`} />
                        {user.blocked ? 'Zablokowany' : 'Aktywny'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      {canModify && (
                        <button
                          onClick={() => handleToggleBlock(user)}
                          title={user.blocked ? 'Odblokuj użytkownika' : 'Zablokuj użytkownika'}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95
                            ${user.blocked
                              ? 'text-success border border-success/30 hover:bg-success/10'
                              : 'text-danger border border-danger/30 hover:bg-danger/10'
                            }`}
                        >
                          {user.blocked ? <><CheckCircle size={13} /> Odblokuj</> : <><Ban size={13} /> Zablokuj</>}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
