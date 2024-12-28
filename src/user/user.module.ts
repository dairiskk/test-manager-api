import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService], // Export UserService to be used in other modules
})
export class UserModule {}
