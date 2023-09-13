import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from './password/password.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private password: PasswordService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: number): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({ where: { email } });
  }

  findByUsername(username: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({ where: { username } });
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
    return this.prisma.user.delete({ where: { id } });
  }
}
