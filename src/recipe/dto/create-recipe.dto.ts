import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ToBoolean } from 'src/decorators/to-boolean.decorator';
import { ToCookingSteps } from 'src/decorators/to-cookingsteps.decorator';
import { CookingStep } from '../cookingstep.model';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  intro: string;

  @ToCookingSteps()
  @IsNotEmpty()
  @ApiProperty()
  steps: CookingStep[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  picture?: string;

  @IsBoolean()
  @ToBoolean()
  @ApiProperty({ default: true })
  public: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  userId: number;
}
