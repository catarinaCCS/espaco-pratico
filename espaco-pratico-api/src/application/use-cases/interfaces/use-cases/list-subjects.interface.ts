import { Subject } from "../../../../domain/entities/subjectEntity/subject.entity";

export interface IListSubjectsUseCase {
    execute(): Promise<Subject[]>;
}