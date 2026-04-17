import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '../types';
import {
  onAuthChanged,
  loginWithGoogle,
  logout,
  isNewUser,
  getOrCreateUserProfile,
} from '../services/authService';
import { userService } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isFirstLogin: boolean;
  login: () => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshCurrentUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChanged(fbUser => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const firstLogin = isNewUser(fbUser.uid);
        const profile = getOrCreateUserProfile(fbUser);
        setCurrentUser(profile);
        setIsFirstLogin(firstLogin);
      } else {
        setCurrentUser(null);
        setIsFirstLogin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshCurrentUser = useCallback(() => {
    if (firebaseUser) {
      const profile = userService.getUserById(firebaseUser.uid);
      if (profile) setCurrentUser(profile);
    }
  }, [firebaseUser]);

  const login = async () => {
    await loginWithGoogle();
  };

  const logoutUser = async () => {
    await logout();
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, isFirstLogin, login, logoutUser, refreshCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
