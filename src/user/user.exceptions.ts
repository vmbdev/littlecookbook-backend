import { HttpException, HttpStatus } from '@nestjs/common';
import { PasswordInvalidData } from './password/password.model';

export class PasswordInvalidException extends HttpException {
  constructor(data: PasswordInvalidData) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'PASSWD_INVALID',
        data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class AuthFailedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'AUTH_FAILED',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
