import mongoose from "mongoose";
import { ISubjectDocument, subjectSchema } from "../schemas/subject.schema";

const SubjectModel = mongoose.model<ISubjectDocument>("Subject", subjectSchema);
export default SubjectModel;