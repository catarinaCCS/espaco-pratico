import { UserController } from "./user.controller";
import { IRegisterUserUseCase } from "../../../../application/use-cases/interfaces/use-cases/register-user.interface";
import { ILoginUserUseCase } from "../../../../application/use-cases/interfaces/use-cases/login-user.interface";
import { IRegisterUserDTO } from "../../../../application/dto/register-user.dto";
import { ILoginUserDTO } from "../../../../application/dto/login-user.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import crypto from "crypto";

const mockRegisterUserUseCase: IRegisterUserUseCase = {
    execute: jest.fn().mockResolvedValue({
        id: crypto.randomUUID(),
        fullName: "John Doe",
        email: "johndoe@email.com"
    })
};

const mockLoginUserUseCase: ILoginUserUseCase = {
    execute: jest.fn().mockResolvedValue(true)
};

const mockRegisterUser: IRegisterUserDTO = {
    fullName: "John Doe",
    email: "johndoe@email.com",
    password: "Senhaforte123!",
}

const mockLoginUser: ILoginUserDTO = {
    email: "johndoe@email.com",
    password: "Senhaforte123!",
}

const mockLoginUserInvalid: ILoginUserDTO = {
    email: "johndoe@email.com",
    password: "SenhaErrada123!",
}

const registerUserUseCase = mockRegisterUserUseCase;
const loginUserUseCase = mockLoginUserUseCase;

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Register", () => {
    it("should register a user successfully", async () => {
        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        const response = await userController.register(mockRegisterUser);

        expect(response).toEqual({
            statusCode: 201,
            message: "User registered successfully",
            data: {
                id: expect.any(String),
                fullName: mockRegisterUser.fullName,
                email: mockRegisterUser.email,
            },
        });
        
        expect(registerUserUseCase.execute).toHaveBeenCalledWith({...mockRegisterUser});
    });

    it("should not register a user with invalid data", async () => {
        (mockRegisterUserUseCase.execute as jest.Mock).mockReset();
        (mockRegisterUserUseCase.execute as jest.Mock).mockRejectedValue(new Error("Invalid data"));

        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        
        await expect(userController.register(mockRegisterUser)).rejects.toThrow(HttpException);
        expect(registerUserUseCase.execute).toHaveBeenCalledWith(mockRegisterUser);
         
        await expect(userController.register({...mockRegisterUser, email: "invalid-email"})).rejects.toMatchObject({
            status: HttpStatus.BAD_REQUEST,
            response: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid data"
            }
        });
    });

    it("should not register a user with an existing email", async () => {
        (mockRegisterUserUseCase.execute as jest.Mock).mockReset();
        (mockRegisterUserUseCase.execute as jest.Mock).mockRejectedValue(new Error("Email already exists"));

        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        
        await expect(userController.register(mockRegisterUser)).rejects.toThrow(HttpException);
        expect(registerUserUseCase.execute).toHaveBeenCalledWith(mockRegisterUser);
         
        await expect(userController.register({...mockRegisterUser})).rejects.toMatchObject({
            status: HttpStatus.BAD_REQUEST,
            response: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Email already exists"
            }
        });
    });

    it("should not register a user with an invalid password", async () => {
        (mockRegisterUserUseCase.execute as jest.Mock).mockReset();
        (mockRegisterUserUseCase.execute as jest.Mock).mockRejectedValue(new Error("Password must have at least one uppercase letter, one lowercase letter, one number and one special character"));

        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        
        await expect(userController.register(mockRegisterUser)).rejects.toThrow(HttpException);
        expect(registerUserUseCase.execute).toHaveBeenCalledWith(mockRegisterUser);
         
        await expect(userController.register({...mockRegisterUser, password: "senhaerrada"})).rejects.toMatchObject({
            status: HttpStatus.BAD_REQUEST,
            response: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Password must have at least one uppercase letter, one lowercase letter, one number and one special character"
            }
        });
    });

    it("should not register a user with an invalid full name", async () => {
        (mockRegisterUserUseCase.execute as jest.Mock).mockReset();
        (mockRegisterUserUseCase.execute as jest.Mock).mockRejectedValue(new Error("Full name must be at least 3 characters long"));

        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        
        await expect(userController.register(mockRegisterUser)).rejects.toThrow(HttpException);
        expect(registerUserUseCase.execute).toHaveBeenCalledWith(mockRegisterUser);
         
        await expect(userController.register({...mockRegisterUser, fullName: "Jo"})).rejects.toMatchObject({
            status: HttpStatus.BAD_REQUEST,
            response: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Full name must be at least 3 characters long"
            }
        });
    });

    it("should not register a user with an invalid email format", async () => {
        (mockRegisterUserUseCase.execute as jest.Mock).mockReset();
        (mockRegisterUserUseCase.execute as jest.Mock).mockRejectedValue(new Error("Invalid email format"));

        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        
        await expect(userController.register(mockRegisterUser)).rejects.toThrow(HttpException);
        expect(registerUserUseCase.execute).toHaveBeenCalledWith(mockRegisterUser);
         
        await expect(userController.register({...mockRegisterUser, email: "invalid-email"})).rejects.toMatchObject({
            status: HttpStatus.BAD_REQUEST,
            response: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid email format"
            }
        });
    });

    it("should not register a user with an empty full name", async () => {
        (mockRegisterUserUseCase.execute as jest.Mock).mockReset();
        (mockRegisterUserUseCase.execute as jest.Mock).mockRejectedValue(new Error("Full name must be at least 3 characters long"));

        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        
        await expect(userController.register(mockRegisterUser)).rejects.toThrow(HttpException);
        expect(registerUserUseCase.execute).toHaveBeenCalledWith(mockRegisterUser);
         
        await expect(userController.register({...mockRegisterUser, fullName: ""})).rejects.toMatchObject({
            status: HttpStatus.BAD_REQUEST,
            response: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Full name must be at least 3 characters long"
            }
        });
    });

    it("should not register a user with an empty email", async () => {
        (mockRegisterUserUseCase.execute as jest.Mock).mockReset();
        (mockRegisterUserUseCase.execute as jest.Mock).mockRejectedValue(new Error("Email is required"));

        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        
        await expect(userController.register(mockRegisterUser)).rejects.toThrow(HttpException);
        expect(registerUserUseCase.execute).toHaveBeenCalledWith(mockRegisterUser);
         
        await expect(userController.register({...mockRegisterUser, email: ""})).rejects.toMatchObject({
            status: HttpStatus.BAD_REQUEST,
            response: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Email is required"
            }
        });
    });

    it("should not register a user with an empty password", async () => {
        (mockRegisterUserUseCase.execute as jest.Mock).mockReset();
        (mockRegisterUserUseCase.execute as jest.Mock).mockRejectedValue(new Error("Password is required"));

        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        
        await expect(userController.register(mockRegisterUser)).rejects.toThrow(HttpException);
        expect(registerUserUseCase.execute).toHaveBeenCalledWith(mockRegisterUser);
         
        await expect(userController.register({...mockRegisterUser, password: ""})).rejects.toMatchObject({
            status: HttpStatus.BAD_REQUEST,
            response: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Password is required"
            }
        });
    });
})

describe("Login", () => {
    it("should login a user successfully", async () => {
        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        const response = await userController.login(mockLoginUser);

        expect(response).toEqual({
            statusCode: 200,
            message: "User logged in successfully",
        });
        expect(loginUserUseCase.execute).toHaveBeenCalledWith({...mockLoginUser});
    });

    it("should not login a user with invalid credentials", async () => {
        (mockLoginUserUseCase.execute as jest.Mock).mockReset();
        (mockLoginUserUseCase.execute as jest.Mock).mockResolvedValue(false);

        const userController = new UserController(registerUserUseCase, loginUserUseCase);
        
        await expect(userController.login(mockLoginUserInvalid)).rejects.toThrow(HttpException);
        expect(loginUserUseCase.execute).toHaveBeenCalledWith(mockLoginUserInvalid);
         
        await expect(userController.login({...mockLoginUser, password:"SenhaErrada123!"})).rejects.toMatchObject({
            status: HttpStatus.UNAUTHORIZED,
            response: {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: "Invalid email or password."
            }
        });
    });
})

describe("Error handling", () => {
  it("should handle unexpected errors with INTERNAL_SERVER_ERROR", async () => {
    (mockRegisterUserUseCase.execute as jest.Mock).mockReset();
    (mockRegisterUserUseCase.execute as jest.Mock).mockRejectedValue("This is not an error object");

    const userController = new UserController(registerUserUseCase, loginUserUseCase);
    
    await expect(userController.register(mockRegisterUser)).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      response: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "An unexpected error occurred."
      }
    });
    
    expect(registerUserUseCase.execute).toHaveBeenCalledWith(mockRegisterUser);
  });
  
  it("should propagate existing HttpException without modification", async () => {
    const httpException = new HttpException(
      { statusCode: HttpStatus.FORBIDDEN, message: "Custom HTTP exception" }, 
      HttpStatus.FORBIDDEN
    );
    
    (mockRegisterUserUseCase.execute as jest.Mock).mockReset();
    (mockRegisterUserUseCase.execute as jest.Mock).mockRejectedValue(httpException);

    const userController = new UserController(registerUserUseCase, loginUserUseCase);
    
    await expect(userController.register(mockRegisterUser)).rejects.toBe(httpException);
    expect(registerUserUseCase.execute).toHaveBeenCalledWith(mockRegisterUser);
  });
});