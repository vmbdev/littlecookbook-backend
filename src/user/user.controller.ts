import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { PasswordService } from './password/password.service';
import { PasswordInvalidException } from './user.exceptions';
import { LoggedInGuard } from 'src/auth/guards/logged-in/logged-in.guard';
import { AdminGuard } from 'src/auth/guards/admin/admin.guard';
import { RequestWithUser } from 'src/auth/requestwithuser.model';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly password: PasswordService,
  ) {}

  @Post()
  @ApiCreatedResponse({ status: 200, type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = createUserDto;
    const passwdCheck = this.password.check(user.password);

    if (passwdCheck.valid) {
      const hashedPwd = await this.password.hash(createUserDto.password);
      user.password = hashedPwd;

      return new UserEntity(await this.userService.create(createUserDto));
    } else {
      throw new PasswordInvalidException(passwdCheck.data);
    }
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOkResponse({ status: 200, type: UserEntity, isArray: true })
  async findAll(): Promise<UserEntity[]> {
    const users = await this.userService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @UseGuards(LoggedInGuard)
  @ApiOkResponse({ status: 200, type: UserEntity })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestWithUser,
  ): Promise<UserEntity> {
    if (request.user.id === id || request.user.role === 'ADMIN') {
      return new UserEntity(await this.userService.findOne(id));
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get('email/:email')
  @UseGuards(AdminGuard)
  @ApiOkResponse({ status: 200, type: UserEntity })
  async findByEmail(@Param('email') email: string): Promise<UserEntity> {
    return new UserEntity(await this.userService.findByEmail(email));
  }

  @Patch(':id')
  @UseGuards(LoggedInGuard)
  @ApiOkResponse({ status: 200, type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: RequestWithUser,
  ) {
    if (request.user.id === id || request.user.role === 'ADMIN') {
      const user = updateUserDto;
      const passwdCheck = this.password.check(user.password);

      if (passwdCheck.valid) {
        const hashedPwd = await this.password.hash(updateUserDto.password);
        user.password = hashedPwd;

        return new UserEntity(await this.userService.update(id, updateUserDto));
      } else {
        throw new PasswordInvalidException(passwdCheck.data);
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
