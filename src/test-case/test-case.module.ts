import { Module } from '@nestjs/common';
import { TestCaseService } from './test-case.service';
import { PrismaService } from '../prisma.service';
import { TestCaseController } from './test-case.controller';

@Module({
  providers: [TestCaseService, PrismaService],
  controllers: [TestCaseController],
})
export class TestCaseModule {}
