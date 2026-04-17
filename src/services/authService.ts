import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User as FirebaseUser, Unsubscribe } from 'firebase/auth';
import { auth } from '../firebase';
import { userService } from './userService';
import { notificationService } from './notificationService';
import type { User } from '../types';
import { SUPER_ADMIN_EMAIL } from '../config';

const googleProvider = new GoogleAuthProvider();

export function loginWithGoogle(): Promise<FirebaseUser> {
  return signInWithPopup(auth, googleProvider).then(result => result.user);
}

export function logout(): Promise<void> {
  return signOut(auth);
}

export function onAuthChanged(
  callback: (user: FirebaseUser | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export function isNewUser(uid: string): boolean {
  return !userService.getUserById(uid);
}

export function getOrCreateUserProfile(firebaseUser: FirebaseUser): User {
  const existing = userService.getUserById(firebaseUser.uid);
  if (existing) return existing;

  const displayName = firebaseUser.displayName || '';
  const parts = displayName.split(' ');
  const firstName = parts[0] || 'Użytkownik';
  const lastName = parts.slice(1).join(' ') || '';

  const isSuperAdmin =
    SUPER_ADMIN_EMAIL !== '' && firebaseUser.email === SUPER_ADMIN_EMAIL;

  const newUser: User = {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    firstName,
    lastName,
    role: isSuperAdmin ? 'admin' : 'guest',
    photoURL: firebaseUser.photoURL ?? undefined,
  };

  userService.saveUser(newUser);

  // Notify all admins about the new account
  const admins = userService.getAllUsers().filter(u => u.role === 'admin' && u.id !== newUser.id);
  admins.forEach(admin => {
    notificationService.create({
      title: 'Nowe konto w systemie',
      message: `${firstName} ${lastName} (${firebaseUser.email ?? ''}) zarejestrował/a się w systemie i oczekuje na zatwierdzenie.`,
      priority: 'high',
      recipientId: admin.id,
    });
  });

  return newUser;
}
