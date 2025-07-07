import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  statusCode: number;
  message: string;
}

export const userService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/users/login', credentials);
    return response.data;
  }
};