import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [PrismaModule],
})
export class RecipeModule {}
