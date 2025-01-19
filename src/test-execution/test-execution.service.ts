import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TestExecution, Prisma } from '@prisma/client';

@Injectable()
export class TestExecutionService {
  constructor(private prisma: PrismaService) {}

  createTestExecution(
    data: Prisma.TestExecutionCreateInput,
  ): Promise<TestExecution> {
    return this.prisma.testExecution.create({
      data,
    });
  }

  getAllTestExecutions(): Promise<TestExecution[]> {
    return this.prisma.testExecution.findMany();
  }

  getTestExecutionById(id: string): Promise<TestExecution | null> {
    return this.prisma.testExecution.findUnique({
      where: { id },
    });
  }

  updateTestExecution(
    id: string,
    data: Prisma.TestExecutionUpdateInput,
  ): Promise<TestExecution | null> {
    return this.prisma.testExecution.update({
      where: { id },
      data,
    });
  }

  deleteTestExecution(id: string): Promise<TestExecution | null> {
    return this.prisma.testExecution.delete({
      where: { id },
    });
  }
}
