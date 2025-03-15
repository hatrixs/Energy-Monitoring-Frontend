import { LoginFormValues, RegisterFormValues } from "../schemas/auth";
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { api } from '../api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
  };
}

// Crear una instancia específica para auth que no use el interceptor de token
const authAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

export const authService = {
  async login(credentials: LoginFormValues): Promise<AuthResponse> {
    try {
      const { data } = await authAxios.post<AuthResponse>('/auth/sign-in', credentials);
      this.saveToken(data.token);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
      }
      throw error;
    }
  },

  async register(userData: RegisterFormValues): Promise<AuthResponse> {
    try {
      const { data } = await authAxios.post<AuthResponse>('/auth/sign-up', userData);
      this.saveToken(data.token);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Error al registrar usuario');
      }
      throw error;
    }
  },

  async checkAuthStatus(): Promise<AuthResponse | null> {
    try {
      const token = this.getToken();
      
      if (!token) {
        return null;
      }

      const { data } = await api.get<AuthResponse>('/auth/check-status');
      
      // Si el backend devuelve un nuevo token como parte de la respuesta, lo actualizamos
      if (data.token && data.token !== token) {
        this.saveToken(data.token);
      }
      
      return data;
    } catch {
      this.removeToken();
      return null;
    }
  },

  saveToken(token: string): void {
    // Guardar en cookies con configuración segura
    Cookies.set('token', token, { 
      expires: 7, // 7 días
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  getToken(): string | null {
    return Cookies.get('token') || null;
  },

  removeToken(): void {
    Cookies.remove('token', { path: '/' });
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    this.removeToken();
  }
}; 