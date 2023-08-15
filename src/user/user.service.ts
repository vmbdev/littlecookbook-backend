import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from './password/password.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private password: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = updateUserDto;
    const passwdCheck = this.password.check(user.password);

    if (passwdCheck.valid) {
      const hashedPwd = await this.password.hash(updateUserDto.password);
      user.password = hashedPwd;
    }

    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
