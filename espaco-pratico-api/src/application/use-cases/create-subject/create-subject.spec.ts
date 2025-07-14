import { CreateSubjectUseCase } from './create-subject.use-case';
import { ISubjectRepository } from '../../../domain/interfaces/repositories/subject-repository.interface';
import { ICreateSubjectDTO } from '../../dto/create-subject.dto';
import { Subject } from '../../../domain/entities/subjectEntity/subject.entity';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

let sut: CreateSubjectUseCase;
let mockSubjectRepository: ISubjectRepository;
let mockSubjectData: ICreateSubjectDTO;
let mockSubject: Subject;

beforeEach(() => {
  mockSubjectRepository = {
    createSubject: jest.fn(),
    listSubjects: jest.fn(),
  };

  mockSubjectData = {
    fullName: 'Mathematics',
  };

  mockSubject = new Subject({
    id: 'mock-uuid',
    fullName: mockSubjectData.fullName,
  });

  sut = new CreateSubjectUseCase(mockSubjectRepository);

  global.crypto = {
    ...global.crypto,
    randomUUID: jest.fn().mockReturnValue('mock-uuid'),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('CreateSubjectUseCase', () => {

  describe('validateData', () => {
    it('should not throw an error when fullName is valid', () => {
      expect(() => CreateSubjectUseCase.validateData(mockSubjectData)).not.toThrow();
    });

    it('should throw BadRequestException when fullName is empty', () => {
      const invalidData = { fullName: '' };

      expect(() => CreateSubjectUseCase.validateData(invalidData))
        .toThrow(new BadRequestException("The subject's full name is required"));
    });

    it('should throw BadRequestException when fullName is not a string', () => {
      const invalidData = { fullName: 123 as unknown as string };

      expect(() => CreateSubjectUseCase.validateData(invalidData))
        .toThrow(new BadRequestException("The subject's full name must be a string"));
    });
  });

  describe('execute', () => {
    it('should create a subject successfully', async () => {
      (mockSubjectRepository.createSubject as jest.Mock).mockResolvedValue(mockSubject);
      const validateDataSpy = jest.spyOn(CreateSubjectUseCase, 'validateData');

      const result = await sut.execute(mockSubjectData);

      expect(validateDataSpy).toHaveBeenCalledWith(mockSubjectData);
      expect(mockSubjectRepository.createSubject).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'mock-uuid',
          fullName: mockSubjectData.fullName,
        })
      );
      expect(result).toEqual(mockSubject);
    });

    it('should trim the subject name before creating', async () => {
      const dataWithSpaces = { fullName: '  Mathematics  ' };
      (mockSubjectRepository.createSubject as jest.Mock).mockResolvedValue({
        ...mockSubject,
        fullName: 'Mathematics',
      });

      await sut.execute(dataWithSpaces);

      expect(mockSubjectRepository.createSubject).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Mathematics',
        })
      );
    });

    it('should throw BadRequestException when validation fails', async () => {
      const invalidData = { fullName: '' };

      await expect(sut.execute(invalidData))
        .rejects
        .toThrow(new BadRequestException("The subject's full name is required"));
      expect(mockSubjectRepository.createSubject).not.toHaveBeenCalled();
    });

    it('should propagate BadRequestException from validation', async () => {
      jest.spyOn(CreateSubjectUseCase, 'validateData').mockImplementation(() => {
        throw new BadRequestException('Custom validation error');
      });

      await expect(sut.execute(mockSubjectData))
        .rejects
        .toThrow(new BadRequestException('Custom validation error'));
      expect(mockSubjectRepository.createSubject).not.toHaveBeenCalled();
    });

    it('should wrap Error in InternalServerErrorException', async () => {
      (mockSubjectRepository.createSubject as jest.Mock).mockRejectedValue(
        new Error('Custom validation error')
      );

      await expect(sut.execute(mockSubjectData))
        .rejects
        .toThrow(new InternalServerErrorException('Custom validation error'));
    });

    it('should wrap non-Error exceptions in InternalServerErrorException', async () => {
      (mockSubjectRepository.createSubject as jest.Mock).mockRejectedValue('String error');

      await expect(sut.execute(mockSubjectData))
        .rejects
        .toThrow(new InternalServerErrorException('Custom validation error'));
    });
  });
});