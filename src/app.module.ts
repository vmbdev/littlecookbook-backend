import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { IngredientModule } from './ingredient/ingredient.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, IngredientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
