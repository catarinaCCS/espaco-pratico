import { ILoginUserDTO } from "../../dto/login-user.dto";
import { IUserRepository } from "../../../domain/interfaces/repositories/user-repository.interface";
import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from "../../../infrastructure/database/mongo/repositories/user-repository/user.repository";
import { ILoginUserUseCase } from "../interfaces/use-cases/login-user.interface";
@Injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
       @Inject(UserRepository) private readonly userRepository: IUserRepository
    ) {}

    async execute(data: ILoginUserDTO): Promise<boolean> {
        const { email, password } = data;

        this.validateData(data);
        const user = await this.userRepository.findUserByEmail(email);

        if (!user) {
            return false;
        }

        return password === user.password;

    }

    private validateData(data: ILoginUserDTO): void {
        if (!data.email || !data.password) {
            throw new Error("Email and password are required");
        }
    }
}