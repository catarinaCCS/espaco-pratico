import { Subject } from "../../../../domain/entities/subjectEntity/subject.entity";
import { ICreateSubjectDTO } from "../../../dto/create-subject.dto";

export interface ICreateSubjectUseCase {
    execute(data: ICreateSubjectDTO): Promise<Subject>;
}