import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '../errors/NotFoundException';

@Injectable()
export class TestPlanService {
  constructor(private prisma: PrismaService) {}

  async createTestPlan(data: { name: string }) {
    return this.prisma.testPlan.create({
      data,
    });
  }

  async getTestPlans() {
    return this.prisma.testPlan.findMany();
  }

  async getTestPlanById(id: string) {
    const testPlan = await this.prisma.testPlan.findUnique({
      where: { id },
    });
    if (!testPlan) {
      throw new NotFoundException();
    }
    return testPlan;
  }

  async updateTestPlan(id: string, data: { name?: string }) {
    const testPlan = await this.prisma.testPlan.findUnique({
      where: { id },
    });
    if (!testPlan) {
      throw new NotFoundException();
    }
    return this.prisma.testPlan.update({
      where: { id },
      data,
    });
  }

  async deleteTestPlan(id: string) {
    const testPlan = await this.prisma.testPlan.findUnique({
      where: { id },
    });
    if (!testPlan) {
      throw new NotFoundException();
    }
    return this.prisma.testPlan.delete({
      where: { id },
    });
  }
}
