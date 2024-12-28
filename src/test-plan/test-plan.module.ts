import { Module } from '@nestjs/common';
import { TestPlanService } from './test-plan.service';
import { TestPlanController } from './test-plan.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TestPlanController],
  providers: [TestPlanService, PrismaService],
})
export class TestPlanModule {}
