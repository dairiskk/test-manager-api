import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(@Body() data: Project): Promise<Project> {
    return this.projectService.createProject(data);
  }

  @Get()
  async getProjects(): Promise<Project[]> {
    return this.projectService.getProjects();
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<Project | null> {
    return this.projectService.getProjectById(id);
  }

  @Put(':id')
  async updateProject(@Param('id') id: string, @Body() data: Project): Promise<Project> {
    return this.projectService.updateProject(id, data);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string): Promise<Project> {
    return this.projectService.deleteProject(id);
  }
}
