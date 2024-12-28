import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { TestExecutionService } from './test-execution.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TestExecution, Prisma } from '@prisma/client';
import { NotFoundException } from '../errors/NotFoundException';

@UseGuards(JwtAuthGuard)
@Controller('test-execution')
export class TestExecutionController {
  constructor(private readonly testExecutionService: TestExecutionService) {}

  @Post()
  create(@Body() data: Prisma.TestExecutionCreateInput): Promise<TestExecution> {
    return this.testExecutionService.createTestExecution(data);
  }

  @Get()
  findAll(): Promise<TestExecution[]> {
    return this.testExecutionService.getAllTestExecutions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TestExecution | null> {
    const testExecution = await this.testExecutionService.getTestExecutionById(id);
    if (!testExecution) {
      throw new NotFoundException(); 
    }
    return testExecution;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.TestExecutionUpdateInput): Promise<TestExecution> {
    try {
      const testExecution = await this.testExecutionService.updateTestExecution(id, data);
      if (!testExecution) {
        throw new NotFoundException();
      }
      return testExecution;
    } catch {
      throw new NotFoundException();
    }
  }
  

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TestExecution> {
    const testExecution = await this.testExecutionService.deleteTestExecution(id);
    if (!testExecution) {
      throw new NotFoundException();
    }
    return testExecution;
  }
}

