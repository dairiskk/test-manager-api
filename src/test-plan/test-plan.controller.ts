import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TestPlanService } from './test-plan.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';


@UseGuards(JwtAuthGuard)
@Controller('test-plans')
export class TestPlanController {
  constructor(private readonly testPlanService: TestPlanService) {}

  @Post()
  async createTestPlan(@Body() body: { name: string }) {
    return this.testPlanService.createTestPlan(body);
  }

  @Get()
  async getTestPlans() {
    return this.testPlanService.getTestPlans();
  }

  @Get(':id')
  async getTestPlanById(@Param('id') id: string) {
    return this.testPlanService.getTestPlanById(id);
  }

  @Put(':id')
  async updateTestPlan(@Param('id') id: string, @Body() body: { name?: string }) {
    return this.testPlanService.updateTestPlan(id, body);
  }

  @Delete(':id')
  async deleteTestPlan(@Param('id') id: string) {
    return this.testPlanService.deleteTestPlan(id);
  }
}
