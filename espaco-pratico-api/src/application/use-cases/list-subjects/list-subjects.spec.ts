import { ListSubjectsUseCase } from './list-subjects.use-case';
import { ISubjectRepository } from '../../../domain/interfaces/repositories/subject-repository.interface';
import { Subject } from '../../../domain/entities/subjectEntity/subject.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

  let sut: ListSubjectsUseCase;
  let mockSubjectRepository: ISubjectRepository;
  let mockSubjects: Subject[];

  beforeEach(() => {
    mockSubjectRepository = {
      createSubject: jest.fn(),
      listSubjects: jest.fn(),
    };

    mockSubjects = [
      new Subject({ id: '1', fullName: 'Mathematics' }),
      new Subject({ id: '2', fullName: 'Physics' }),
      new Subject({ id: '3', fullName: 'Chemistry' }),
    ];

    sut = new ListSubjectsUseCase(mockSubjectRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
describe('ListSubjectsUseCase', () => {

  describe('execute', () => {
    it('should return a list of subjects when subjects exist', async () => {
      (mockSubjectRepository.listSubjects as jest.Mock).mockResolvedValue(mockSubjects);

      const result = await sut.execute();

      expect(mockSubjectRepository.listSubjects).toHaveBeenCalled();
      expect(result).toEqual(mockSubjects);
      expect(result.length).toBe(3);
      expect(result[0]).toBeInstanceOf(Subject);
    });

    it('should return an empty array when no subjects are found', async () => {
      const emptySubjects: Subject[] = [];
      (mockSubjectRepository.listSubjects as jest.Mock).mockResolvedValue(emptySubjects);

      const result = await sut.execute();

      expect(mockSubjectRepository.listSubjects).toHaveBeenCalled();
      expect(result).toEqual(emptySubjects);
      expect(result.length).toBe(0);
    });

    it('should handle repository errors and wrap them in InternalServerErrorException', async () => {
      const error = new Error('Database error');
      (mockSubjectRepository.listSubjects as jest.Mock).mockRejectedValue(error);

      await expect(sut.execute())
        .rejects
        .toThrow(new InternalServerErrorException('Database error'));
      expect(mockSubjectRepository.listSubjects).toHaveBeenCalled();
    });

    it('should handle NotFoundException and propagate it', async () => {
      const notFoundError = new NotFoundException('No subjects found');
      (mockSubjectRepository.listSubjects as jest.Mock).mockRejectedValue(notFoundError);

      await expect(sut.execute())
        .rejects
        .toThrow(notFoundError);
      expect(mockSubjectRepository.listSubjects).toHaveBeenCalled();
    });

    it('should wrap non-Error exceptions in InternalServerErrorException', async () => {
      (mockSubjectRepository.listSubjects as jest.Mock).mockRejectedValue('String error');

      await expect(sut.execute())
        .rejects
        .toThrow(new InternalServerErrorException('Error listing subjects: String error'));
      expect(mockSubjectRepository.listSubjects).toHaveBeenCalled();
    });

    it('should handle null response from repository', async () => {
      (mockSubjectRepository.listSubjects as jest.Mock).mockResolvedValue(null);

      const result = await sut.execute();

      expect(mockSubjectRepository.listSubjects).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle undefined response from repository', async () => {
      (mockSubjectRepository.listSubjects as jest.Mock).mockResolvedValue(undefined);

      const result = await sut.execute();

      expect(mockSubjectRepository.listSubjects).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});