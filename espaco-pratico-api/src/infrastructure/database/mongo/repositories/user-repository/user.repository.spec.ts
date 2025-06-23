import { UserRepository } from './user.repository';
import UserModel from '../../models/user.model';
import { User } from '../../../../../domain/entities/userEntity/user.entity';
import mongoose from 'mongoose';
import { IUserDocument } from '../../schemas/user.schema';

jest.mock('../../models/user.model', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findById: jest.fn(() => ({ exec: jest.fn() })),
    findOne: jest.fn(() => ({ exec: jest.fn() })),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(() => ({ exec: jest.fn() })),
  },
}));

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockUser: User;
  let mockUserDocument: Partial<IUserDocument>;
  let mockId: string;

  beforeEach(() => {
    userRepository = new UserRepository(UserModel);
    mockId = new mongoose.Types.ObjectId().toString();
    
    mockUser = new User({
      id: mockId,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
    });

    mockUserDocument = {
      _id: mockId,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      createdAt: new Date(),
      updatedAt: new Date(),
      toObject: jest.fn(() => ({
        _id: mockId,
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
      })),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return a User entity', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue(mockUserDocument);

      const result = await userRepository.createUser(mockUser);

      expect(UserModel.create).toHaveBeenCalledWith({
        fullName: mockUser.fullName,
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(result).toBeInstanceOf(User);
      expect(result.fullName).toBe(mockUser.fullName);
      expect(result.email).toBe(mockUser.email);
      expect(result.password).toBe(mockUser.password);
    });

    it('should throw an error if creation fails', async () => {
      const error = new Error('Creation failed');
      (UserModel.create as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.createUser(mockUser)).rejects.toThrow(error);
    });

    it('should not create a user with an existing email', async () => {
      const error = new Error("User with this email already exists");
      // error.name = 'MongoServerError';
      (UserModel.create as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.createUser(mockUser)).rejects.toThrow('User with this email already exists'); 
    });
  });

  describe('findUserById', () => {
    it('should find a user by id and return a User entity', async () => {
      const execMock = jest.fn().mockResolvedValue(mockUserDocument);
      (UserModel.findById as jest.Mock).mockReturnValue({ exec: execMock });

      const result = await userRepository.findUserById(mockId);

      expect(UserModel.findById).toHaveBeenCalledWith(mockId);
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(mockId);
    });

    it('should return null if user is not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      (UserModel.findById as jest.Mock).mockReturnValue({ exec: execMock });

      const result = await userRepository.findUserById("nonexistentId");

      expect(result).toBeNull();
    });

    it('should throw an error if finding fails', async () => {
      const error = new Error('Find failed');
      const execMock = jest.fn().mockRejectedValue(error);
      (UserModel.findById as jest.Mock).mockReturnValue({ exec: execMock });

      await expect(userRepository.findUserById(mockId)).rejects.toThrow(error);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email and return a User entity', async () => {
      const execMock = jest.fn().mockResolvedValue(mockUserDocument);
      (UserModel.findOne as jest.Mock).mockReturnValue({ exec: execMock });

      const result = await userRepository.findUserByEmail(mockUser.email);

      expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeInstanceOf(User);
      expect(result?.email).toBe(mockUser.email);
    });

    it('should return null if user is not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      (UserModel.findOne as jest.Mock).mockReturnValue({ exec: execMock });

      const result = await userRepository.findUserByEmail("nonexistentEmail");

      expect(result).toBeNull();
    });

    it('should throw an error if finding fails', async () => {
      const error = new Error('Find failed');
      const execMock = jest.fn().mockRejectedValue(error);
      (UserModel.findOne as jest.Mock).mockReturnValue({ exec: execMock });

      await expect(userRepository.findUserByEmail(mockUser.email)).rejects.toThrow(error);
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated User entity', async () => {
      const updateData = { fullName: 'Jane Doe' };
      const updatedMockUserDocument = {
        ...mockUserDocument,
        fullName: 'Jane Doe',
      };
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedMockUserDocument);

      const result = await userRepository.updateUser(mockId, updateData);

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockId,
        { ...updateData },
        { new: true }
      );
      expect(result).toBeInstanceOf(User);
      expect(result?.fullName).toBe('Jane Doe');
    });

    it('should return null if user to update is not found', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.updateUser("nonexistentId", { fullName: 'Jane Doe' });

      expect(result).toBeNull();
    });

    it('should throw an error if update fails', async () => {
      const error = new Error('Update failed');
      (UserModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);

      await expect(userRepository.updateUser(mockId, { fullName: 'Jane Doe' })).rejects.toThrow(error);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return true if successful', async () => {
      const execMock = jest.fn().mockResolvedValue(mockUserDocument);
      (UserModel.findByIdAndDelete as jest.Mock).mockReturnValue({ exec: execMock });

      const result = await userRepository.deleteUser(mockId);

      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(mockId);
      expect(execMock).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if user to delete is not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      (UserModel.findByIdAndDelete as jest.Mock).mockReturnValue({ exec: execMock });

      const result = await userRepository.deleteUser("nonexistentId");

      expect(result).toBe(false);
    });

    it('should throw an error if deletion fails', async () => {
      const error = new Error('Delete failed');
      const execMock = jest.fn().mockRejectedValue(error);
      (UserModel.findByIdAndDelete as jest.Mock).mockReturnValue({ exec: execMock });

      await expect(userRepository.deleteUser(mockId)).rejects.toThrow(error);
    });
  });

  describe('mapToEntity', () => {
    it('should map a document to a User entity', () => {
      const mapToEntityMethod = (userRepository as any).mapToEntity.bind(userRepository);
      
      const result = mapToEntityMethod(mockUserDocument);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(mockId);
      expect(result.fullName).toBe(mockUserDocument.fullName);
      expect(result.email).toBe(mockUserDocument.email);
      expect(result.password).toBe(mockUserDocument.password);
    });

    it('should throw an error if document is null', () => {
      const mapToEntityMethod = (userRepository as any).mapToEntity.bind(userRepository);
      
      expect(() => mapToEntityMethod(null)).toThrow('Document is null or undefined');
    });
  });
});