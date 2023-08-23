import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PasswordService } from 'src/user/password/password.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {}

  async authenticateUser(
    signinField: string,
    password: string,
  ): Promise<UserEntity | null> {
    let user: User;

    if (this.isEmail(signinField)) {
      user = await this.userService.findByEmail(signinField);
    } else {
      user = await this.userService.findByUsername(signinField);
    }

    const isPasswordCorrect = await this.passwordService.compare(
      password,
      user.password,
    );

    if (isPasswordCorrect) return new UserEntity(user);
    else return null;
  }

  isEmail(email: string): boolean {
    return email.match(/^\S+@\S+\.\S+$/i) !== null;
  }
}
