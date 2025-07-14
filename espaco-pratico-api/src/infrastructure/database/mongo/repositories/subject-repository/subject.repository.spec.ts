import { SubjectRepository } from './subject.repository';
import { Subject } from '../../../../../domain/entities/subjectEntity/subject.entity';
import mongoose from 'mongoose';
import { ISubjectDocument } from '../../schemas/subject.schema';

jest.mock('../../models/subject.model', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        find: jest.fn(() => ({ exec: jest.fn() })),
    },
}));

let subjectRepository: SubjectRepository;
let mockSubject: Subject;
let mockSubjectDocument: Partial<ISubjectDocument>;
let mockId: string;

beforeEach(() => {
    const SubjectModel = require('../../models/subject.model').default;
    subjectRepository = new SubjectRepository(SubjectModel);
    mockId = new mongoose.Types.ObjectId().toString();

    mockSubject = new Subject({
        id: mockId,
        fullName: 'Mathematics',
    });

    mockSubjectDocument = {
        _id: mockId,
        fullName: 'Mathematics',
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: jest.fn(() => ({
            _id: mockId,
            fullName: 'Mathematics',
        })),
    };
});

afterEach(() => {
    jest.clearAllMocks();
});
describe('SubjectRepository', () => {

    describe('createSubject', () => {
        it('should create a subject and return a Subject entity', async () => {
            const SubjectModel = require('../../models/subject.model').default;
            (SubjectModel.create as jest.Mock).mockResolvedValue(mockSubjectDocument);

            const result = await subjectRepository.createSubject(mockSubject);

            expect(SubjectModel.create).toHaveBeenCalledWith({
                fullName: mockSubject.fullName,
            });
            expect(result).toBeInstanceOf(Subject);
            expect(result.fullName).toBe(mockSubject.fullName);
        });

        it('should throw an error if creation fails', async () => {
            const SubjectModel = require('../../models/subject.model').default;
            const error = new Error('Creation failed');
            (SubjectModel.create as jest.Mock).mockRejectedValue(error);

            await expect(subjectRepository.createSubject(mockSubject)).rejects.toThrow(error);
        });
    });

    describe('listSubjects', () => {
        it('should return a list of Subject entities', async () => {
            const SubjectModel = require('../../models/subject.model').default;
            const execMock = jest.fn().mockResolvedValue([mockSubjectDocument, mockSubjectDocument]);
            (SubjectModel.find as jest.Mock).mockReturnValue({ exec: execMock });

            const result = await subjectRepository.listSubjects();

            expect(SubjectModel.find).toHaveBeenCalled();
            expect(execMock).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Subject);
            expect(result[0].fullName).toBe(mockSubject.fullName);
        });

        it('should return an empty array if no subjects are found', async () => {
            const SubjectModel = require('../../models/subject.model').default;
            const execMock = jest.fn().mockResolvedValue([]);
            (SubjectModel.find as jest.Mock).mockReturnValue({ exec: execMock });

            const result = await subjectRepository.listSubjects();

            expect(SubjectModel.find).toHaveBeenCalled();
            expect(execMock).toHaveBeenCalled();
            expect(result).toHaveLength(0);
        });

        it('should throw an error if listing fails', async () => {
            const SubjectModel = require('../../models/subject.model').default;
            const error = new Error('Listing failed');
            const execMock = jest.fn().mockRejectedValue(error);
            (SubjectModel.find as jest.Mock).mockReturnValue({ exec: execMock });

            await expect(subjectRepository.listSubjects()).rejects.toThrow(error);
        });
    });

    describe('mapToEntity', () => {
        it('should map a document to a Subject entity', () => {
            const mapToEntityMethod = (subjectRepository as any).mapToEntity.bind(subjectRepository);

            const result = mapToEntityMethod(mockSubjectDocument);

            expect(result).toBeInstanceOf(Subject);
            expect(result.id).toBe(mockId);
            expect(result.fullName).toBe(mockSubjectDocument.fullName);
        });

        it('should throw an error if document is null', () => {
            const mapToEntityMethod = (subjectRepository as any).mapToEntity.bind(subjectRepository);

            expect(() => mapToEntityMethod(null)).toThrow('Document is null or undefined');
        });
    });
});