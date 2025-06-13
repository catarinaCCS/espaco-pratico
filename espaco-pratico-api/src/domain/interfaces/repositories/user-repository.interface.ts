import { User } from "../../entities/userEntity/user.entity";

export interface IUserRepository {
    createUser(user: User): Promise<User>;
    findUserById(id: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    updateUser(id: string, user: Partial<User>): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
}
