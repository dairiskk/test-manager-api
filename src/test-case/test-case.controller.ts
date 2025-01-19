import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TestCaseService } from './test-case.service';
import { TestCase } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('test-cases')
export class TestCaseController {
  constructor(private readonly testCaseService: TestCaseService) {}

  @Post()
  async createTestCase(@Body() data: TestCase): Promise<TestCase> {
    return this.testCaseService.createTestCase(data);
  }

  @Get()
  async getTestCases(): Promise<TestCase[]> {
    return this.testCaseService.getTestCases();
  }

  @Get(':id')
  async getTestCaseById(@Param('id') id: string): Promise<TestCase | null> {
    return this.testCaseService.getTestCaseById(id);
  }

  @Put(':id')
  async updateTestCase(
    @Param('id') id: string,
    @Body() data: TestCase,
  ): Promise<TestCase> {
    return this.testCaseService.updateTestCase(id, data);
  }

  @Delete(':id')
  async deleteTestCase(@Param('id') id: string): Promise<TestCase> {
    return this.testCaseService.deleteTestCase(id);
  }
}
