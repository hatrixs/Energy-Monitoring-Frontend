'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth-service';
import { LoginFormValues } from '@/lib/schemas/auth';

interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginFormValues) => Promise<void>;
  register: (userData: RegisterFormValues) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Comprobar si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const authResponse = await authService.checkAuthStatus();
        if (authResponse) {
          setUser(authResponse.user);
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginFormValues) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      authService.saveToken(response.token);
      setUser(response.user);
      // Navegación directa sin transiciones
      router.push('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      authService.saveToken(response.token);
      setUser(response.user);
      router.push('/');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // Navegación directa sin transiciones
    router.push('/auth/login');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
} 