import { ILoginUserDTO } from "../../../dto/login-user.dto";


export interface ILoginUserUseCase {
    execute(userData: ILoginUserDTO): Promise<Boolean>;
}