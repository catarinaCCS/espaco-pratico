import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { UserController } from './controllers/user.controller';
import { LoginUserUseCase } from '../../application/use-cases/login-user/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user/register-user.use-case';
import { UserRepository } from '../../infrastructure/database/mongo/repositories/user-repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '../../infrastructure/database/mongo/schemas/user.schema';

@Module({
  controllers: [AppController, UserController],
  providers: [LoginUserUseCase, RegisterUserUseCase, UserRepository],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
})
export class HttpModule {}