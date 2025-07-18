import { subjectServices } from '../subjectServices';
import api from '../api';

jest.mock('../api');

describe('subjectServices', () => {
  const mockSubjects = [
    { _id: '1', _fullName: 'Mathematics' },
    { _id: '2', _fullName: 'Physics' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listSubjects', () => {
    it('should return subjects when API call succeeds with status 201', async () => {
      const mockResponse = {
        data: {
          statusCode: 201,
          data: mockSubjects,
          message: 'Subjects retrieved successfully'
        }
      };
      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await subjectServices.listSubjects();

      expect(api.get).toHaveBeenCalledWith('/subjects/list');
      expect(result).toEqual(mockResponse.data);
      expect(result.statusCode).toBe(201);
      expect(result.data).toEqual(mockSubjects);
    });

    it('should handle 400 error from API', async () => {
      const error = new Error('Request failed with status code 400');
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await subjectServices.listSubjects();

      expect(api.get).toHaveBeenCalledWith('/subjects/list');
      expect(result).toEqual({
        statusCode: 400,
        message: 'Erro ao listar disciplinas.'
      });
    });

    it('should handle 500 error from API', async () => {
      const error = new Error('Request failed with status code 500');
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await subjectServices.listSubjects();

      expect(api.get).toHaveBeenCalledWith('/subjects/list');
      expect(result).toEqual({
        statusCode: 500,
        message: 'Erro interno do servidor. Tente novamente mais tarde.'
      });
    });

    it('should handle unknown error types', async () => {
      const error = new Error('Unknown error');
      (api.get as jest.Mock).mockRejectedValue(error);

      const result = await subjectServices.listSubjects();

      expect(api.get).toHaveBeenCalledWith('/subjects/list');
      expect(result).toEqual({
        statusCode: 500,
        message: 'Erro desconhecido. Tente novamente mais tarde.'
      });
    });

    it('should handle non-Error objects', async () => {
      (api.get as jest.Mock).mockRejectedValue('Not an error object');

      const result = await subjectServices.listSubjects();

      expect(api.get).toHaveBeenCalledWith('/subjects/list');
      expect(result).toEqual({
        statusCode: 500,
        message: 'Erro desconhecido. Tente novamente mais tarde.'
      });
    });

    it('should handle network errors correctly', async () => {
      const networkError = new Error('Network Error');
      (api.get as jest.Mock).mockRejectedValue(networkError);

      const result = await subjectServices.listSubjects();

      expect(api.get).toHaveBeenCalledWith('/subjects/list');
      expect(result.statusCode).toBe(500);
      expect(result.message).toBe('Erro desconhecido. Tente novamente mais tarde.');
    });

    it('should handle unexpected response format correctly', async () => {
      const unexpectedResponse = {
        data: {
          success: true,
          subjects: mockSubjects
        }
      };
      (api.get as jest.Mock).mockResolvedValue(unexpectedResponse);

      const result = await subjectServices.listSubjects();

      expect(api.get).toHaveBeenCalledWith('/subjects/list');
      expect(result).toEqual(unexpectedResponse.data);
    });

    it('should handle empty response data correctly', async () => {
      const emptyResponse = {
        data: {
          statusCode: 201,
          data: [],
          message: 'No subjects found'
        }
      };
      (api.get as jest.Mock).mockResolvedValue(emptyResponse);

      const result = await subjectServices.listSubjects();

      expect(api.get).toHaveBeenCalledWith('/subjects/list');
      expect(result.data).toEqual([]);
    });

    it('should handle null response data correctly', async () => {
      const nullResponse = {
        data: {
          statusCode: 201,
          data: null,
          message: 'No subjects available'
        }
      };
      (api.get as jest.Mock).mockResolvedValue(nullResponse);

      const result = await subjectServices.listSubjects();

      expect(api.get).toHaveBeenCalledWith('/subjects/list');
      expect(result.data).toBeNull();
    });
  });
});