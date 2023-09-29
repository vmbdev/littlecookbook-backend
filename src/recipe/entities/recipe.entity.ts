import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Recipe } from '@prisma/client';
import { CookingStep } from '../cookingstep.model';

export class RecipeEntity implements Recipe {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  intro: string;

  @ApiProperty()
  steps: CookingStep[];

  @ApiPropertyOptional({ nullable: true })
  picture: string | null;

  @ApiProperty()
  public: boolean;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
