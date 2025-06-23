import { User } from "../../../../domain/entities/userEntity/user.entity";
import { IRegisterUserDTO } from "../../../dto/register-user.dto";

export interface IRegisterUserUseCase {
    execute(userData: IRegisterUserDTO): Promise<User>;
}