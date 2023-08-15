import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordService } from './password/password.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService, PasswordService],
  imports: [PrismaModule],
})
export class UserModule {}
