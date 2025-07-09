import { userService } from '../userServices';
import api from '../api';

jest.mock('../api');

const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Email ou senha inválidos.',
    SERVER_ERROR: 'Erro interno do servidor. Tente novamente mais tarde.',
    UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente mais tarde.'
};

const STATUS_CODES = {
    OK: 200,
    UNAUTHORIZED: 401,
    SERVER_ERROR: 500
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('userService', () => {
    describe('login', () => {
        const credentials = {
            email: 'test@example.com',
            password: 'password123'
        };

        it('should return success response when API call succeeds', async () => {
            const mockResponse = {
                data: {
                    statusCode: STATUS_CODES.OK,
                    message: 'Login successful'
                }
            };

            (api.post as jest.Mock).mockResolvedValue(mockResponse);

            const result = await userService.login(credentials);

            expect(api.post).toHaveBeenCalledTimes(1);
            expect(api.post).toHaveBeenCalledWith('/users/login', credentials);
            expect(result).toEqual(mockResponse.data);
        });

        it('should return 401 error when credentials are invalid', async () => {
            const error = new Error('Request failed with status code 401');
            (api.post as jest.Mock).mockRejectedValue(error);

            const result = await userService.login(credentials);

            expect(api.post).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                statusCode: STATUS_CODES.UNAUTHORIZED,
                message: ERROR_MESSAGES.INVALID_CREDENTIALS
            });
        });

        it('should return 500 error when server error occurs', async () => {
            const error = new Error('Request failed with status code 500');
            (api.post as jest.Mock).mockRejectedValue(error);

            const result = await userService.login(credentials);

            expect(api.post).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                statusCode: STATUS_CODES.SERVER_ERROR,
                message: ERROR_MESSAGES.SERVER_ERROR
            });
        });

        it('should return generic 500 error for unknown error types', async () => {
            const error = new Error('Unknown error');
            (api.post as jest.Mock).mockRejectedValue(error);

            const result = await userService.login(credentials);

            expect(api.post).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                statusCode: STATUS_CODES.SERVER_ERROR,
                message: ERROR_MESSAGES.UNKNOWN_ERROR
            });
        });

        it('should return generic 500 error when error is not an Error instance', async () => {
            (api.post as jest.Mock).mockRejectedValue('Not an error object');

            const result = await userService.login(credentials);

            expect(api.post).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                statusCode: STATUS_CODES.SERVER_ERROR,
                message: ERROR_MESSAGES.UNKNOWN_ERROR
            });
        });

        it('should handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            (api.post as jest.Mock).mockRejectedValue(networkError);

            const result = await userService.login(credentials);

            expect(api.post).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                statusCode: STATUS_CODES.SERVER_ERROR,
                message: ERROR_MESSAGES.UNKNOWN_ERROR
            });
        });

        it('should handle unexpected response format correctly', async () => {
            const unexpectedResponse = {
                data: {
                    success: true,
                    user: { id: 1 }
                }
            };

            (api.post as jest.Mock).mockResolvedValue(unexpectedResponse);

            const result = await userService.login(credentials);

            expect(api.post).toHaveBeenCalledTimes(1);
            expect(result).toEqual(unexpectedResponse.data);
        });
    });
});