import { IUserRepository } from "../../../domain/interfaces/repositories/user-repository.interface";
import { User, TUserProperties} from "../../../domain/entities/userEntity/user.entity";
import { IRegisterUserDTO } from "../../dto/register-user.dto";
import crypto from "crypto";
import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from "../../../infrastructure/database/mongo/repositories/user-repository/user.repository";

@Injectable()
export class RegisterUserUseCase {

    constructor(
        @Inject(UserRepository) private readonly userRepository: IUserRepository
    ) {}
    
    async execute(userData: IRegisterUserDTO): Promise<User> {
        try {

            this.validateRequiredFields(userData);

            await this.validateEmailDoesNotExist(userData.email);
            
            const userId = this.generateUserId();

            const userProperties: TUserProperties = {
                id: userId,
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
            };

            const user = new User(userProperties);

            return this.userRepository.createUser(user);
        }
        catch (error) {

            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Error creating user: ${error}`);
        }
    }

    validateRequiredFields(userData: IRegisterUserDTO): void {

        if (!userData.fullName || !userData.email || !userData.password) {
            throw new Error("All fields are required: fullName, email, and password.");
        };
    }

    async validateEmailDoesNotExist(email: string): Promise<void> {

        const userExists = await this.userRepository.findUserByEmail(email);
        if (userExists) {
            throw new Error("User with this email already exists.");
        }
    }

    generateUserId(): string {

        return crypto.randomUUID();
    }
}