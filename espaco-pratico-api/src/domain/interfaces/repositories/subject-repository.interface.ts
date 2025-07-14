import { Subject } from "../../entities/subjectEntity/subject.entity";

export interface ISubjectRepository {
    createSubject(subject: Subject): Promise<Subject>;
    listSubjects(): Promise<Subject[]>;
}