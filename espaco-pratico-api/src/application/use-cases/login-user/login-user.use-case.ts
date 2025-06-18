import { ILoginUserDTO } from "../../dto/login-user.dto";
import { IUserRepository } from "../../../domain/interfaces/repositories/user-repository.interface";
import { User } from "../../../domain/entities/userEntity/user.entity";

export class LoginUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async login(data: ILoginUserDTO): Promise<boolean> {
        const { email, password } = data;

        this.validateData(data);
        const user = await this.findUserByEmail(email);

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

    private async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findUserByEmail(email);
    }
}