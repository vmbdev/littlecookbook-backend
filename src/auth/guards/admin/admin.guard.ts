import { ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RequestWithUser } from 'src/auth/requestwithuser.model';
import { LoggedInGuard } from '../logged-in/logged-in.guard';

@Injectable()
export class AdminGuard extends LoggedInGuard {
  async canActivate(context: ExecutionContext) {
    const isLoggedIn = super.canActivate(context);
    const req: RequestWithUser = context.switchToHttp().getRequest();
    const isAdmin = req.user.role === Role.ADMIN;

    return isLoggedIn && isAdmin;
  }
}
