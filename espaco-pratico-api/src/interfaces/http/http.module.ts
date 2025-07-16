import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { UserController } from './controllers/user/user.controller';
import { LoginUserUseCase } from '../../application/use-cases/login-user/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user/register-user.use-case';
import { UserRepository } from '../../infrastructure/database/mongo/repositories/user-repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '../../infrastructure/database/mongo/schemas/user.schema';
import { SubjectController } from './controllers/subject/subject.controller';
import { SubjectRepository } from '../../infrastructure/database/mongo/repositories/subject-repository/subject.repository';
import { subjectSchema } from '../../infrastructure/database/mongo/schemas/subject.schema';
import { CreateSubjectUseCase } from '../../application/use-cases/create-subject/create-subject.use-case';
import { ListSubjectsUseCase } from '../../application/use-cases/list-subjects/list-subjects.use-case';

@Module({
  controllers: [AppController, UserController, SubjectController],
  providers: [LoginUserUseCase, RegisterUserUseCase, UserRepository, SubjectRepository, CreateSubjectUseCase, ListSubjectsUseCase],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }, { name: 'Subject', schema: subjectSchema }])],
})
export class HttpModule { }