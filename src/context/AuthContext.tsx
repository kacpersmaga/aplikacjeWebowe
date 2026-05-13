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

// ── Test mode ─────────────────────────────────────────────────────────────────
// When VITE_E2E_TEST=true the app skips Firebase auth and uses a mock admin.
// This keeps E2E tests simple without needing real Google credentials.
const E2E_TEST = import.meta.env.VITE_E2E_TEST === 'true';

const TEST_ADMIN: User = {
  id: 'test-admin-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'Admin',
  role: 'admin',
};

const TEST_USERS: User[] = [
  TEST_ADMIN,
  { id: 'test-dev-1', email: 'dev@example.com', firstName: 'Jan', lastName: 'Kowalski', role: 'developer' },
  { id: 'test-devops-1', email: 'devops@example.com', firstName: 'Anna', lastName: 'Nowak', role: 'devops' },
];

async function seedTestUsers() {
  for (const u of TEST_USERS) {
    const existing = await userService.getUserById(u.id);
    if (!existing) await userService.saveUser(u);
  }
}
// ─────────────────────────────────────────────────────────────────────────────

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
    // In E2E test mode skip Firebase entirely
    if (E2E_TEST) {
      seedTestUsers().then(() => {
        setCurrentUser(TEST_ADMIN);
        setLoading(false);
      });
      return;
    }

    const unsubscribe = onAuthChanged(fbUser => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        (async () => {
          const firstLogin = await isNewUser(fbUser.uid);
          const profile = await getOrCreateUserProfile(fbUser);
          setCurrentUser(profile);
          setIsFirstLogin(firstLogin);
          setLoading(false);
        })();
      } else {
        setCurrentUser(null);
        setIsFirstLogin(false);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const refreshCurrentUser = useCallback(() => {
    if (E2E_TEST) return;
    if (firebaseUser) {
      userService.getUserById(firebaseUser.uid).then(profile => {
        if (profile) setCurrentUser(profile);
      });
    }
  }, [firebaseUser]);

  const login = async () => {
    if (E2E_TEST) return;
    await loginWithGoogle();
  };

  const logoutUser = async () => {
    if (E2E_TEST) return;
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
