import { TUserProperties, User } from "../../../../../domain/entities/userEntity/user.entity";
import { IUserDocument } from "../../schemas/user.schema";
import { IUserRepository } from "../../../../../domain/interfaces/repositories/user-repository.interface";
import { Error, Model } from "mongoose";
import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
@Injectable()
export class UserRepository implements IUserRepository {

    constructor(
        @InjectModel('User') private readonly userModel: Model<IUserDocument>
    ) {}
    
    async createUser(user: User): Promise<User> {

        try {
            const newUser = await this.userModel.create({
                fullName: user.fullName,
                email: user.email,
                password: user.password,
            });
            return this.mapToEntity(newUser);
        }
        catch (error) {

            if (error instanceof Error && error.name === 'MongoServerError'){
                console.error("User with this email already exists:", error);
                throw new Error("User with this email already exists");
            }

            console.error("Error creating user:", error);
            throw error;
        }       
    }

    async findUserById(id: string): Promise<User | null> {
        try {
            const user = await this.userModel.findById(id).exec();
            
            return user ? this.mapToEntity(user) : null;
        }
        catch (error) {
            console.error("Error finding user by ID:", error);
            throw error;
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        
        try {
            const user = await this.userModel.findOne({ email }).exec();
    
            return user ? this.mapToEntity(user) : null;
        }
        catch (error) {
            console.error("Error finding user by email:", error);
            throw error;
        }
    }

    async updateUser(id: string, userData: Partial<TUserProperties>): Promise<User | null> {

        try {
            const updateUser = await this.userModel.findByIdAndUpdate(
                id,
                { ...userData },
                { new: true },
            );
    
            return updateUser ? this.mapToEntity(updateUser) : null;
        }
        catch (error: any) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async deleteUser(id: string): Promise<boolean> {

        try {
            const result = await this.userModel.findByIdAndDelete(id).exec();
    
            return result !== null;
        }
        catch (error: any) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

    private mapToEntity(document: IUserDocument): User {

        if (!document) throw new Error("Document is null or undefined");

        return new User({
            id: document._id.toString(),
            fullName: document.fullName,
            email: document.email,
            password: document.password,
         })
    }
}
