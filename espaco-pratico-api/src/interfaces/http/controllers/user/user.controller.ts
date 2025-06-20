import { RegisterUserUseCase } from "../../../../application/use-cases/register-user/register-user.use-case";
import { LoginUserUseCase } from "../../../../application/use-cases/login-user/login-user.use-case";
import { IRegisterUserDTO } from "../../../../application/dto/register-user.dto";
import { ILoginUserDTO } from "../../../../application/dto/login-user.dto";
import { Body, Controller, HttpException, HttpStatus, Inject, Post } from "@nestjs/common";
import { TRegisterResponse, TLoginResponse } from "../../interfaces/api.response.interface";
import { IRegisterUserUseCase } from "../../../../application/use-cases/interfaces/use-cases/register-user.interface";
import { ILoginUserUseCase } from "../../../../application/use-cases/interfaces/use-cases/login-user.interface";

@Controller('users')
export class UserController {
    constructor(

        @Inject(RegisterUserUseCase)
        private readonly registerUserUseCase: IRegisterUserUseCase,

        @Inject(LoginUserUseCase)
        private readonly loginUserUseCase: ILoginUserUseCase
    ) {}

    @Post('register')
    async register(@Body() userData: IRegisterUserDTO): Promise<TRegisterResponse> {
        try {
            const user = await this.registerUserUseCase.execute(userData);
            return {
                statusCode: HttpStatus.CREATED,
                message: "User registered successfully",
                data: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                }
            }
        }
        catch (error) {
            return this.handleError(error, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('login')
    async login(@Body() loginData: ILoginUserDTO): Promise<TLoginResponse> {
        try {
            const isAuthenticated = await this.loginUserUseCase.execute(loginData);
        
            if (!isAuthenticated) {
                throw new HttpException({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: "Invalid email or password."
                },
                HttpStatus.UNAUTHORIZED
                );
            }

            return {
                statusCode: HttpStatus.OK,
                message: "User logged in successfully",
            };
        } 
        catch (error) {
            return this.handleError(error, HttpStatus.UNAUTHORIZED);
        }
    }

    private handleError(error: unknown, statusCode: HttpStatus): never {
        if (error instanceof HttpException) {
            throw error;
        }

        if (error instanceof Error) {
            throw new HttpException({
                statusCode: statusCode,
                message: error.message,
            }, 
            statusCode
            );
        }

        throw new HttpException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "An unexpected error occurred."
        }, HttpStatus.INTERNAL_SERVER_ERROR);

    }

}
