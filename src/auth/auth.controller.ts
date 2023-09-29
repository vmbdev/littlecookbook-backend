import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/guards/local/local.auth.guard';
import { LoggedInGuard } from 'src/guards/logged-in/logged-in.guard';
import { RequestWithUser } from './requestwithuser.model';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  @Get()
  @UseGuards(LoggedInGuard)
  @ApiOkResponse({ status: 200 })
  async authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ status: 200 })
  async logIn(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Post('logout')
  @UseGuards(LoggedInGuard)
  @ApiOkResponse({ status: 204 })
  async logOut(@Req() request: RequestWithUser) {
    request.logOut((err) => {
      if (err) throw new HttpException(err, HttpStatus.BAD_REQUEST);
      else {
        request.session.cookie.maxAge = 0;
      }
    });
  }
}
