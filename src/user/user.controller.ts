import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
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

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly password: PasswordService,
  ) {}

  @Post()
  @ApiCreatedResponse({ status: 200, type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
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
  @ApiOkResponse({ status: 200, type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(':id')
  @ApiOkResponse({ status: 200, type: UserEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ status: 200, type: UserEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
