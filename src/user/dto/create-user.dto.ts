import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ToBoolean } from 'src/decorators/to-boolean.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(32)
  @ApiProperty({ required: true })
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @IsOptional()
  @ApiPropertyOptional()
  bio?: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  @ApiProperty({ default: true })
  public?: boolean = true;
}
