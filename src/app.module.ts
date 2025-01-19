import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { TestCaseModule } from './test-case/test-case.module';
import { TestExecutionModule } from './test-execution/test-execution.module';
import { TestPlanModule } from './test-plan/test-plan.module';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    AuthModule,
    TestCaseModule,
    TestExecutionModule,
    TestPlanModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
