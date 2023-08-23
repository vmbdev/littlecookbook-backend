import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local/local.strategy';
import { LocalSerializer } from './serializers/local.serializer';

@Module({
  providers: [AuthService, LocalStrategy, LocalSerializer],
  imports: [UserModule, PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
