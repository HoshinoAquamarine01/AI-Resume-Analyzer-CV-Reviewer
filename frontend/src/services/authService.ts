import axiosInstance from './axiosInstance';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

class AuthService {

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<{
        status: string;
        message: string;
        data: {
          user: User;
          token: string;
        };
      }>('/api/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      const { user, token } = response.data.data;

      if (credentials.rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
        localStorage.setItem('token', token);
      }

      return { user, token };
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      let errorMessage = 'Login failed. Please check your credentials and try again.';

      if (Array.isArray(serverMessage)) {
        errorMessage = serverMessage.join(', ');
      } else if (typeof serverMessage === 'string') {
        errorMessage = serverMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<{
        status: string;
        message: string;
        data: {
          user: User;
          token: string;
        };
      }>('/api/auth/register', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      });

      const { user, token } = response.data.data;
      localStorage.setItem('token', token);

      return { user, token };
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      let errorMessage = 'Registration failed. Please try again.';

      if (Array.isArray(serverMessage)) {
        errorMessage = serverMessage.join(', ');
      } else if (typeof serverMessage === 'string') {
        errorMessage = serverMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.warn('Logout API warning:', error);
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }

  async loginWithProvider(provider: 'google' | 'github'): Promise<void> {
    const backendUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/${provider}`;
  }
}

export const authService = new AuthService();
export default authService;