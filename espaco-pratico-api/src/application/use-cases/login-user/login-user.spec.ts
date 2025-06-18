import { LoginUserUseCase } from "./login-user.use-case";
import { IUserRepository } from "../../../domain/interfaces/repositories/user-repository.interface";
import { ILoginUserDTO } from "../../dto/login-user.dto";

const mockData: ILoginUserDTO = {
    email: "johndoe@test.com",
    password:  "Senhaforte123!",
};

const mockUserRepository: IUserRepository = {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    findUserById: jest.fn(),
};

const loginUserUseCase = new LoginUserUseCase(mockUserRepository);

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Login", () => {

    it("should throw an error if email is missing", async () => {
        await expect(loginUserUseCase.login({ ...mockData, email: "" })).rejects.toThrow("Email and password are required");
    });

    it("should throw an error if password is missing", async () => {
        await expect(loginUserUseCase.login({ ...mockData, password: "" })).rejects.toThrow("Email and password are required");
    });

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

    it("should call Login with the correct parameters", () => {
        const loginSpy = jest.spyOn(loginUserUseCase, "login");

        loginUserUseCase.login(mockData);
        expect(loginSpy).toHaveBeenCalledWith(mockData);
    });

    it("should call confirmEmail with the correct email", async () => {
        const confirmEmailSpy = jest.spyOn(mockUserRepository, "findUserByEmail");

        await loginUserUseCase.login(mockData);
        expect(confirmEmailSpy).toHaveBeenCalledWith(mockData.email);
    });

    it ("should return boolean", async () => {
        const mockUser = { ...mockData, id: "123" };

        mockUserRepository.findUserByEmail = jest.fn().mockResolvedValue(mockUser);

        const result = await loginUserUseCase.login(mockData);
        expect(typeof result).toBe("boolean");
    });

    it("should error be the kind of Error", async () => {
        await expect(loginUserUseCase.login({ ...mockData, email: "" })).rejects.toBeInstanceOf(Error);
    });
});
