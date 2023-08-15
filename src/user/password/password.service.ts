import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordCheckResult } from './password.model';
import { password as passwordConfig } from '../../littlecookbook.config';

@Injectable()
export class PasswordService {
  hash(password: string) {
    return bcrypt.hash(password, 10);
  }

  compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  check(password: string): PasswordCheckResult {
    const result: PasswordCheckResult = { valid: true, data: {} };

    result.data.minLength = password.length >= passwordConfig.minLength;

    if (passwordConfig.requireUppercase) {
      const regex = /.*([A-Z]).*/;
      result.data.hasUppercase = regex.test(password);
      result.valid &&= result.data.hasUppercase;
    }

    if (passwordConfig.requireNumber) {
      const regex = /.*(\d).*/;
      result.data.hasNumber = regex.test(password);
      result.valid &&= result.data.hasNumber;
    }

    if (passwordConfig.requireNonAlphanumeric) {
      const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      result.data.hasNonAlphanumeric = regex.test(password);
      result.valid &&= result.data.hasNonAlphanumeric;
    }

    result.valid &&= result.data.minLength;

    return result;
  }
}
