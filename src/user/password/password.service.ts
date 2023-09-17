import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PasswordCheckResult } from './password.model';

@Injectable()
export class PasswordService {
  constructor(private readonly config: ConfigService) {}

  hash(password: string) {
    return bcrypt.hash(password, 10);
  }

  compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  check(password: string): PasswordCheckResult {
    const result: PasswordCheckResult = { valid: true, data: {} };

    result.data.minLength =
      password.length >= this.config.get<number>('password.minLength');
    result.valid &&= result.data.minLength;

    if (this.config.get<boolean>('password.requireUppercase')) {
      const regex = /.*([A-Z]).*/;
      result.data.hasUppercase = regex.test(password);
      result.valid &&= result.data.hasUppercase;
    }

    if (this.config.get<boolean>('password.requireNumber')) {
      const regex = /.*(\d).*/;
      result.data.hasNumber = regex.test(password);
      result.valid &&= result.data.hasNumber;
    }

    if (this.config.get<boolean>('password.requireNonAlphanumeric')) {
      const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      result.data.hasNonAlphanumeric = regex.test(password);
      result.valid &&= result.data.hasNonAlphanumeric;
    }

    return result;
  }
}
