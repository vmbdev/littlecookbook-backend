import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { mixin } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/requestwithuser.model';
import { PrismaService } from 'src/prisma/prisma.service';

export const OwnershipGuard = (model: string) => {
  class OwnershipGuardMixin implements CanActivate {
    constructor(@Inject(PrismaService) public prisma: PrismaService) {}

    async canActivate(context: ExecutionContext) {
      const req: RequestWithUser = context.switchToHttp().getRequest();
      const { id } = req.params;
      const delegate = this.getModelDelegate();
      const res = await delegate.findUnique({ where: { id: +id } });

      if (res.userId === req.user.id) return true;
      else return false;
    }

    getModelDelegate() {
      let delegate;

      switch (model) {
        case 'recipe': {
          delegate = this.prisma.recipe;
          break;
        }
        case 'ingredient': {
          delegate = this.prisma.ingredient;
          break;
        }
      }

      return delegate;
    }
  }

  const guard = mixin(OwnershipGuardMixin);
  return guard;
};
