import { SubjectController } from './subject.controller';
import { ListSubjectsUseCase } from '../../../../application/use-cases/list-subjects/list-subjects.use-case';
import { CreateSubjectUseCase } from '../../../../application/use-cases/create-subject/create-subject.use-case';
import { Subject } from '../../../../domain/entities/subjectEntity/subject.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

let sut: SubjectController;
let mockListSubjectsUseCase: jest.Mocked<ListSubjectsUseCase>;
let mockCreateSubjectUseCase: jest.Mocked<CreateSubjectUseCase>;
let mockSubject: Subject;

beforeEach(() => {
  // Arrange - Setup mocks
  mockListSubjectsUseCase = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<ListSubjectsUseCase>;

  mockCreateSubjectUseCase = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<CreateSubjectUseCase>;

  mockSubject = new Subject({
    id: 'mock-id',
    fullName: 'Mathematics',
  });

  // Create the controller with mocked dependencies
  sut = new SubjectController(
    mockListSubjectsUseCase,
    mockCreateSubjectUseCase,
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('SubjectController', () => {

  describe('create', () => {
    it('should create a subject successfully and return correct response', async () => {
      const subjectData = { fullName: 'Mathematics' };
      mockCreateSubjectUseCase.execute.mockResolvedValue(mockSubject);

      const result = await sut.create(subjectData);

      expect(mockCreateSubjectUseCase.execute).toHaveBeenCalledWith(subjectData);
      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Subject created successfully',
        data: mockSubject,
      });
    });

    it('should handle errors from CreateSubjectUseCase and throw HttpException', async () => {
      const subjectData = { fullName: 'Mathematics' };
      const error = new Error('Subject creation failed');
      mockCreateSubjectUseCase.execute.mockRejectedValue(error);

      await expect(sut.create(subjectData)).rejects.toThrow(HttpException);
      expect(mockCreateSubjectUseCase.execute).toHaveBeenCalledWith(subjectData);
    });

    it('should propagate HttpException from CreateSubjectUseCase', async () => {
      const subjectData = { fullName: 'Mathematics' };
      const httpException = new HttpException(
        'Custom HTTP exception',
        HttpStatus.BAD_REQUEST,
      );
      mockCreateSubjectUseCase.execute.mockRejectedValue(httpException);

      await expect(sut.create(subjectData)).rejects.toBe(httpException);
      expect(mockCreateSubjectUseCase.execute).toHaveBeenCalledWith(subjectData);
    });

    it('should handle non-Error exceptions and wrap them in HttpException', async () => {
      const subjectData = { fullName: 'Mathematics' };
      mockCreateSubjectUseCase.execute.mockRejectedValue('String error');

      await expect(sut.create(subjectData)).rejects.toThrow(HttpException);
      expect(mockCreateSubjectUseCase.execute).toHaveBeenCalledWith(subjectData);
    });
  });

  describe('list', () => {
    it('should return a list of subjects successfully', async () => {
      const mockSubjects = [mockSubject, mockSubject];
      mockListSubjectsUseCase.execute.mockResolvedValue(mockSubjects);

      const result = await sut.list();

      expect(mockListSubjectsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(mockSubjects);
      expect(result.length).toBe(2);
    });

    it('should return an empty array when no subjects are found', async () => {
      const emptySubjects: Subject[] = [];
      mockListSubjectsUseCase.execute.mockResolvedValue(emptySubjects);

      const result = await sut.list();

      expect(mockListSubjectsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(emptySubjects);
      expect(result.length).toBe(0);
    });

    it('should handle errors from ListSubjectsUseCase and throw HttpException', async () => {
      const error = new Error('Failed to list subjects');
      mockListSubjectsUseCase.execute.mockRejectedValue(error);

      await expect(sut.list()).rejects.toThrow(HttpException);
      expect(mockListSubjectsUseCase.execute).toHaveBeenCalled();
    });

    it('should propagate HttpException from ListSubjectsUseCase', async () => {
      const httpException = new HttpException(
        'Custom HTTP exception',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      mockListSubjectsUseCase.execute.mockRejectedValue(httpException);

      await expect(sut.list()).rejects.toBe(httpException);
      expect(mockListSubjectsUseCase.execute).toHaveBeenCalled();
    });

    it('should handle non-Error exceptions and wrap them in HttpException', async () => {
      mockListSubjectsUseCase.execute.mockRejectedValue('String error');

      await expect(sut.list()).rejects.toThrow(HttpException);
      expect(mockListSubjectsUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('handleError', () => {
    it('should propagate HttpException without modification', async () => {
      const httpException = new HttpException(
        'Original exception',
        HttpStatus.BAD_REQUEST,
      );
      mockCreateSubjectUseCase.execute.mockRejectedValue(httpException);

      await expect(sut.create({ fullName: 'Test' })).rejects.toBe(httpException);
    });

    it('should wrap Error in HttpException with provided status code', async () => {
      const error = new Error('Test error');
      mockCreateSubjectUseCase.execute.mockRejectedValue(error);

      try {
        await sut.create({ fullName: 'Test' });
        fail('Expected exception was not thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);

        if (e instanceof HttpException) {
          expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
          expect(e.getResponse()).toEqual({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Test error',
          });
        }
      }
    });

    it('should wrap non-Error exceptions in HttpException with INTERNAL_SERVER_ERROR', async () => {
      mockCreateSubjectUseCase.execute.mockRejectedValue('Not an error');

      try {
        await sut.create({ fullName: 'Test' });
        fail('Expected exception was not thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);

        if (e instanceof HttpException) {
          expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
          expect(e.getResponse()).toEqual({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred.',
          });
        }
      }
    });
  });
});