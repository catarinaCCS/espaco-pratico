import { LoginUserUseCase } from "./login-user.use-case";
import { IUserRepository } from "../../../domain/interfaces/repositories/user-repository.interface";
import { ILoginUserDTO } from "../../dto/login-user.dto";

const mockData: ILoginUserDTO = {
    email: "johndoe@test.com",
    password:  "Senhaforte123!",
};

const mockUserRepository: IUserRepository = {
    findUserByEmail:jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    findUserById: jest.fn(),
};

const loginUserUseCase = new LoginUserUseCase(mockUserRepository);

beforeEach(() => {
    jest.clearAllMocks();
});

describe("validateData", () => {
    it("should not throw an error if email and password are provided", () => {
        expect(() => loginUserUseCase.validateData(mockData)).not.toThrow();
    });

    it("should throw an error if email is missing", () => {
   
        expect(() => loginUserUseCase.validateData({ ...mockData, email: "" })).toThrow("Email and password are required");
    });

    it("should throw an error if password is missing", () => {
   
        expect(() => loginUserUseCase.validateData({ ...mockData, password: "" })).toThrow("Email and password are required");
    });
});

describe("Login", () => {


    it("should return false if user is not found", async () => {
        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(null);

        const result = await loginUserUseCase.login({...mockData, email: "notexist@email.com"});
        expect(result).toBe(false);
    });

    it("should return true if user is found and password matches", async () => {
        const mockUser = { ...mockData, id: "123" };

        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(mockUser);

        const result = await loginUserUseCase.login(mockData);
        expect(result).toBe(true);
    });

    it("should return false if user is found but password does not match", async () => {
        const mockUser = { ...mockData, password: "WrongPassword123!", id: "123" };

        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(mockUser);

        const result = await loginUserUseCase.login(mockData);
        expect(result).toBe(false);
    });

    it("should call validateData with the correct parameters", () => {
        const validateDataSpy = jest.spyOn(loginUserUseCase, "validateData");

        loginUserUseCase.login(mockData);
        expect(validateDataSpy).toHaveBeenCalledWith(mockData);
    });

    it("should call confirmEmail with the correct email", async () => {
        const confirmEmailSpy = jest.spyOn(mockUserRepository, "findUserByEmail");

        await loginUserUseCase.login(mockData);
        expect(confirmEmailSpy).toHaveBeenCalledWith(mockData.email);
    });
});
