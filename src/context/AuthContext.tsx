import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function getUsers(): User[] {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  }

  function saveUsers(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function login(email: string, password: string): boolean {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('currentUser', JSON.stringify(found));
      return true;
    }
    return false;
  }

  function signup(email: string, password: string, name: string): boolean {
    const users = getUsers();
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
    };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('currentUser');
  }

  function updateUser(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
    const users = getUsers().map(u => u.id === updated.id ? updated : u);
    saveUsers(users);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
