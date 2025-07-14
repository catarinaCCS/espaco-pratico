import { Subject } from "../../../domain/entities/subjectEntity/subject.entity";
import { ISubjectRepository } from "../../../domain/interfaces/repositories/subject-repository.interface";
import { SubjectRepository } from "../../../infrastructure/database/mongo/repositories/subject-repository/subject.repository";
import { ICreateSubjectDTO } from "../../dto/create-subject.dto";
import { ICreateSubjectUseCase } from "../interfaces/use-cases/create-subject.interface";
import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class CreateSubjectUseCase implements ICreateSubjectUseCase {
    constructor(
        @Inject(SubjectRepository) private readonly subjectRepository: ISubjectRepository
    ) { }

    async execute(subjectData: ICreateSubjectDTO): Promise<Subject> {
        try {
            CreateSubjectUseCase.validateData(subjectData);

            const subject = new Subject({
                id: crypto.randomUUID(),
                fullName: subjectData.fullName.trim(),
            });

            return await this.subjectRepository.createSubject(subject);

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            if (error instanceof Error) {
                throw new InternalServerErrorException(error.message);
            }

            throw new InternalServerErrorException(`Error creating subject: ${error}`);
        }
    }

    static validateData(data: ICreateSubjectDTO): void {
        if (!data.fullName) {
            throw new BadRequestException("The subject's full name is required");
        }

        if (typeof data.fullName !== 'string') {
            throw new BadRequestException("The subject's full name must be a string");
        }
    }
}