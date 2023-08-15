import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @ApiProperty({ required: false })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @IsOptional()
  @ApiProperty({ required: false })
  bio?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: true })
  public?: boolean = true;
}
