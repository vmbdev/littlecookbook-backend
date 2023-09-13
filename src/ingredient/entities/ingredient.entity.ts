import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Ingredient } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class IngredientEntity implements Ingredient {
  constructor(partial: Partial<IngredientEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true })
  picture: string | null;

  @ApiPropertyOptional({ nullable: true })
  @Exclude()
  userId: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
