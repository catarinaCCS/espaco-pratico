import { RegisterUserUseCase } from "./register-user.use-case";
import { IUserRepository } from "../../../domain/interfaces/repositories/user-repository.interface";
import { User } from "../../../domain/entities/userEntity/user.entity";

const mockUserData = {
    fullName: "John Doe",
    email: "johndoe@test.com",
    password: "Securepassword123!",
};

const mockUser = {
    _id: "mocked-generated-id",
    _fullName: mockUserData.fullName,
    _email: mockUserData.email,
    _password: mockUserData.password,
};

const mockUserRepository: IUserRepository = {
    createUser: jest.fn(),
    findUserById: jest.fn(),
    findUserByEmail: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
};

const registerUserUseCase = new RegisterUserUseCase(mockUserRepository);

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Validate required fields", () => {

    it("should not throw an error if all required fields are present", () => {
        expect(() => registerUserUseCase.validateRequiredFields(mockUserData)).not.toThrow();
    });

    it("should throw an error if fullName is missing", () => {
        const userData = {
            ...mockUserData,
            fullName: "",
        };

        expect(() => registerUserUseCase.validateRequiredFields(userData)).toThrow("All fields are required: fullName, email, and password.");
    });

    it("should throw an error if email is missing", () => {
        const userData = {
            ...mockUserData,
            email: "",
        };

        expect(() => registerUserUseCase.validateRequiredFields(userData)).toThrow("All fields are required: fullName, email, and password.");
    });

    it("should throw an error if password is missing", () => {
        const userData = {
            ...mockUserData,
            password: "",
        }

        expect(() => registerUserUseCase.validateRequiredFields(userData)).toThrow("All fields are required: fullName, email, and password.");
    });
});

describe("Validate email does not exist", () => {
    it("should not throw an error if email does not exist", async () => {
        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(null);

        await expect(registerUserUseCase.validateEmailDoesNotExist('email@notexist.com')).resolves.not.toThrow();

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith('email@notexist.com');
    });

    it("should throw an error if email already exists", async () => {
        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue({});

        await expect(registerUserUseCase.validateEmailDoesNotExist(mockUserData.email)).rejects.toThrow("User with this email already exists.");

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith('johndoe@test.com');
    });
});

describe("Generate user ID", () => {
    it("should generate a valid UUID", () => {
        const userId = registerUserUseCase.generateUserId();

        expect(typeof userId).toBe('string');
        expect(userId).toHaveLength(36);
        expect(userId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    });

    it("should generate unique IDs on multiple calls", () => {
        const userId1 = registerUserUseCase.generateUserId();
        const userId2 = registerUserUseCase.generateUserId();
        const userId3 = registerUserUseCase.generateUserId();

        expect(userId1).not.toBe(userId2);
        expect(userId1).not.toBe(userId3);
        expect(userId2).not.toBe(userId3);
    });
});

describe("Execute use case", () => {
    it("should call repository with correct user object when creating a user", async () => {
        mockUserRepository.createUser = jest.fn().mockResolvedValue(
            {...mockUserData, 
                id: 'mocked-generated-id'
            });

        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(null);

        const result = await registerUserUseCase.execute(mockUserData);

        expect(mockUserRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
            ...mockUser, 
            _id: expect.any(String)
        }));
    });

    it("should return the created user object", async () => {
        mockUserRepository.createUser = jest.fn().mockResolvedValue(mockUser);

        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(null);

        const result = await registerUserUseCase.execute(mockUserData);

        expect(result).toEqual(mockUser);
    });

    it("should generate a user ID when creating a user", async () => {
        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(null);
        mockUserRepository.createUser = jest.fn().mockResolvedValue({...mockUserData, id: 'some-id'});
        
        const spy = jest.spyOn(registerUserUseCase, 'generateUserId');
        
        await registerUserUseCase.execute(mockUserData);
        
        expect(spy).toHaveBeenCalledTimes(1);
        
        spy.mockRestore();
    });

    it("should throw an error if user creation fails", async () => {
        mockUserRepository.createUser = jest.fn().mockRejectedValue(new Error("Database error")); 

        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(null);

        await expect(registerUserUseCase.execute(mockUserData)).rejects.toThrow("Database error");
    });

    it("should throw an error if required fields are missing", async () => {
        const invalidData = { ...mockUserData, fullName: "" };

        await expect(registerUserUseCase.execute(invalidData)).rejects.toThrow("All fields are required: fullName, email, and password.");
    });

    it("should throw an error if email already exists", async () => {
        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue({});

        await expect(registerUserUseCase.execute(mockUserData)).rejects.toThrow("User with this email already exists.");
    });

    it("should encapsulate non-Error exceptions during user creation", async () => {
        const spy = jest.spyOn(registerUserUseCase, 'validateEmailDoesNotExist')
            .mockImplementation(() => {
                throw "Not an Error instance"; // Lançando string
            });
        
        await expect(registerUserUseCase.execute(mockUserData))
            .rejects
            .toThrow("Error creating user: Not an Error instance");

        spy.mockRestore();
    });
});