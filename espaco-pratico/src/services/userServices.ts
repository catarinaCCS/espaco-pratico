import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  fullName: string;
}

type AuthResponse = ErrorResponse | SuccessResponse;

interface SuccessResponse {
  statusCode: number;
  message: string;
}

interface ErrorResponse {
  statusCode: number;
  message: string;
}

export const userService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/users/login', credentials);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          return {
            statusCode: 401,
            message: "Email ou senha inválidos."
          };
        }

        if (error.message.includes('500')) {
          return {
            statusCode: 500,
            message: "Erro interno do servidor. Tente novamente mais tarde."
          };
        }

        return {
          statusCode: 500,
          message: "Erro desconhecido. Tente novamente mais tarde."
        };
      } else {
        return {
          statusCode: 500,
          message: "Erro desconhecido. Tente novamente mais tarde."
        };
      }
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/users/register', credentials);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('400')) {
          return {
            statusCode: 400,
            message: "Não foi possível criar o usuário. Verifique os dados informados."
          };
        }

        return {
          statusCode: 500,
          message: "Erro interno do servidor. Tente novamente mais tarde."
        };
      } else {
        return {
          statusCode: 500,
          message: "Erro desconhecido. Tente novamente mais tarde."
        };
      }
    }
  }
};