import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TestCase, Prisma } from '@prisma/client';

@Injectable()
export class TestCaseService {
  constructor(private prisma: PrismaService) {}

  async createTestCase(data: Prisma.TestCaseCreateInput): Promise<TestCase> {
    return this.prisma.testCase.create({ data });
  }

  async getTestCases(): Promise<TestCase[]> {
    return this.prisma.testCase.findMany();
  }

  async getTestCaseById(id: string): Promise<TestCase | null> {
    return this.prisma.testCase.findUnique({ where: { id } });
  }

  async updateTestCase(id: string, data: Prisma.TestCaseUpdateInput): Promise<TestCase> {
    return this.prisma.testCase.update({ where: { id }, data });
  }

  async deleteTestCase(id: string): Promise<TestCase> {
    return this.prisma.testCase.delete({ where: { id } });
  }
}
