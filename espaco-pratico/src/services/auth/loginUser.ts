import axios from 'axios';

interface LoginUserData {
  email: string;
  password: string;
}

interface LoginResponse {
  statusCode: number;
  message: string;
}

export const loginUser = async (userData: LoginUserData): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      '/api/users/login',
      userData
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as LoginResponse;
    }
    
    return {
      statusCode: 500,
      message: 'An unexpected error occurred during login.'
    };
  }
};