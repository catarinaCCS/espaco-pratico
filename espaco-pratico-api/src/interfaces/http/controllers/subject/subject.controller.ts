import { ListSubjectsUseCase } from "../../../../application/use-cases/list-subjects/list-subjects.use-case";
import { CreateSubjectUseCase } from "../../../../application/use-cases/create-subject/create-subject.use-case";
import { Inject, Controller, Post, Body, Get, HttpException, HttpStatus } from "@nestjs/common";
import { Subject } from "../../../../domain/entities/subjectEntity/subject.entity";
import { TCreateSubjectResponse } from "../../interfaces/api.response.interface";

@Controller('subjects')
export class SubjectController {

    constructor(
        @Inject(ListSubjectsUseCase)
        private readonly listSubjectsUseCase: ListSubjectsUseCase,

        @Inject(CreateSubjectUseCase)
        private readonly createSubjectUseCase: CreateSubjectUseCase
    ) { }

    @Post('create')
    async create(@Body() subjectData: { fullName: string }): Promise<TCreateSubjectResponse> {
        try {
            const subject = await this.createSubjectUseCase.execute(subjectData);

            return {
                statusCode: HttpStatus.CREATED,
                message: 'Subject created successfully',
                data: subject as Subject
            };
        } catch (error) {
            this.handleError(error, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('list')
    async list(): Promise<Subject[]> {
        try {
            return await this.listSubjectsUseCase.execute();
        } catch (error) {
            this.handleError(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private handleError(error: unknown, statusCode: HttpStatus): never {
        if (error instanceof HttpException) {
            throw error;
        }

        if (error instanceof Error) {
            throw new HttpException({
                statusCode: statusCode,
                message: error.message,
            },
                statusCode
            );
        }

        throw new HttpException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "An unexpected error occurred."
        }, HttpStatus.INTERNAL_SERVER_ERROR);

    }

}