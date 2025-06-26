import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  updateEmail: (newEmail: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory user store for demo
const users: { [email: string]: { name: string; password: string } } = {};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const existing = users[email];
    if (existing && existing.password === password) {
      setUser({ name: existing.name, email });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    if (users[email]) return false;
    users[email] = { name, password };
    setUser({ name, email });
    return true;
  };

  const updateEmail = async (newEmail: string) => {
    if (!user) return false;
    if (users[newEmail]) return false;
    users[newEmail] = { name: user.name, password: users[user.email].password };
    delete users[user.email];
    setUser({ ...user, email: newEmail });
    return true;
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) return false;
    users[user.email].password = newPassword;
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, signup, updateEmail, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 