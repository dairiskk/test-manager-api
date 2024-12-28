import { Module } from '@nestjs/common';
import { TestExecutionService } from './test-execution.service';
import { TestExecutionController } from './test-execution.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TestExecutionController],
  providers: [TestExecutionService, PrismaService],
})
export class TestExecutionModule {}
