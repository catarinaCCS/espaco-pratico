import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

type LoginResponse = ErrorResponse | SuccesResResponse;

interface SuccesResResponse {
  statusCode: number;
  message: string;
}
interface ErrorResponse {
  statusCode: number;
  message: string;
}

export const userService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {

    try {

      const response = await api.post('/users/login', credentials);
      return response.data;

    } catch (error: unknown) {

      if (error instanceof Error) {

        if (error.message.includes('401')) {
          return {
            statusCode: 401,
            message: "Email ou senha inválidos."
          }
        }
    
        if (error.message.includes('500')) {
          return {
            statusCode: 500,
            message: "Erro interno do servidor. Tente novamente mais tarde."
          }
        }

        return {
          statusCode: 500,
          message: "Erro desconhecido. Tente novamente mais tarde."
        }

      } else {
        return {
          statusCode: 500,
          message: "Erro desconhecido. Tente novamente mais tarde."
        };
      }
    }
  }

};