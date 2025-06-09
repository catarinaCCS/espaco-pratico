import mongoose from "mongoose";
import { userSchema, IUserDocument } from "../schemas/user.schema";

const UserModel = mongoose.model<IUserDocument>("User", userSchema);
export default UserModel;