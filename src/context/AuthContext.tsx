import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  autoLogin: boolean;
  login: (email: string, password: string, auto: boolean) => boolean;
  signup: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    const auto = localStorage.getItem('autoLogin') === 'true';
    setAutoLogin(auto);
    if (auto) {
      const saved = localStorage.getItem('currentUser');
      if (saved) setUser(JSON.parse(saved));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, []);

  function getUsers(): User[] {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  }

  function saveUsers(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function login(email: string, password: string, auto: boolean): boolean {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      if (!found.plan) found.plan = '무료';
      setUser(found);
      setAutoLogin(auto);
      localStorage.setItem('currentUser', JSON.stringify(found));
      localStorage.setItem('autoLogin', auto ? 'true' : 'false');
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
    setAutoLogin(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('autoLogin');
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
    <AuthContext.Provider value={{ user, autoLogin, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
