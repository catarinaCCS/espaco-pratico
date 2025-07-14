import { Error, Model } from "mongoose";
import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { ISubjectRepository } from "../../../../../domain/interfaces/repositories/subject-repository.interface";
import { ISubjectDocument } from "../../schemas/subject.schema";
import { Subject } from "../../../../../domain/entities/subjectEntity/subject.entity";

@Injectable()
export class SubjectRepository implements ISubjectRepository {

    constructor(
        @InjectModel('Subject') private readonly subjectModel: Model<ISubjectDocument>
    ) { }

    async createSubject(subject: Subject): Promise<Subject> {

        try {
            const newSubject = await this.subjectModel.create({
                fullName: subject.fullName,
            });
            return this.mapToEntity(newSubject);
        }
        catch (error) {

            if (error instanceof Error && error.name === 'MongoServerError') {
                console.error("Subject with this name already exists:", error);
                throw new Error("Subject with this name already exists");
            }

            console.error("Error creating subject:", error);
            throw error;
        }
    }

    async listSubjects(): Promise<Subject[]> {
        try {
            const subjects = await this.subjectModel.find().exec();
            return subjects.map(subject => this.mapToEntity(subject));
        }
        catch (error) {
            console.error("Error listing subjects:", error);
            throw error;
        }
    }

    private mapToEntity(document: ISubjectDocument): Subject {

        if (!document) throw new Error("Document is null or undefined");

        return new Subject({
            id: document._id.toString(),
            fullName: document.fullName,
        })
    }
}