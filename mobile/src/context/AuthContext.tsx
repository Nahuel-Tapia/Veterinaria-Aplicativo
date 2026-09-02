import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';

export interface User {
  uuid: string;
  username: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface AuthContextData {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  registerUser: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const savedUser = await AsyncStorage.getItem('user_data');
      const token = await AsyncStorage.getItem('user_token');

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error('Error cargando sesión de AsyncStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(username: string, password: string) {
    const res = await api.post('/login', { username, password });
    if (res && res.token) {
      await AsyncStorage.setItem('user_token', res.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(res.user));
      setUser(res.user);
      setIsLoggedIn(true);
    } else {
      throw new Error('Respuesta de login inválida.');
    }
  }

  async function registerUser(userData: any) {
    await api.post('/register', userData);
  }

  async function logout() {
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_data');
    setUser(null);
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
