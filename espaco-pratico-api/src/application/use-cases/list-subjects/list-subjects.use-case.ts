import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IListSubjectsUseCase } from '../interfaces/use-cases/list-subjects.interface';
import { SubjectRepository } from '../../../infrastructure/database/mongo/repositories/subject-repository/subject.repository';
import { Subject } from '../../../domain/entities/subjectEntity/subject.entity';
import { ISubjectRepository } from '../../../domain/interfaces/repositories/subject-repository.interface';

@Injectable()
export class ListSubjectsUseCase implements IListSubjectsUseCase {
    constructor(
        @Inject(SubjectRepository) private readonly subjectRepository: ISubjectRepository
    ) { }

    async execute(): Promise<Subject[]> {

        try {
            const subjects = await this.subjectRepository.listSubjects();

            return subjects
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            if (error instanceof Error) {
                throw new InternalServerErrorException(error.message);
            }

            throw new InternalServerErrorException(`Error listing subjects: ${error}`);
        }

    }
}