import { RegisterUserUseCase } from "../../../application/use-cases/register-user/register-user.use-case";
import { LoginUserUseCase } from "../../../application/use-cases/login-user/login-user.use-case";
import { ILoginUserDTO } from "../../../application/dto/login-user.dto";
import { IRegisterUserDTO } from "../../../application/dto/register-user.dto";
import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";

@Controller('users')
export class UserController {
    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
        private readonly loginUserUseCase: LoginUserUseCase
    ) {}

    @Post('register')
    async register(@Body() userData: IRegisterUserDTO) {
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
            if (error instanceof Error) {
                throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: error.message,
                }, 
                HttpStatus.BAD_REQUEST
                );
            }
            throw new HttpException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "An unexpected error occurred while registering the user."
            }, 
            HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('login')
    async login(@Body() loginData: ILoginUserDTO) {
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
            if (error instanceof HttpException) {
                throw error;
            }
            if (error instanceof Error) {
                throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: error.message,
                }, 
                HttpStatus.BAD_REQUEST
                );
            }
            throw new HttpException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "An unexpected error occurred while logging in the user."
            }, 
            HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
