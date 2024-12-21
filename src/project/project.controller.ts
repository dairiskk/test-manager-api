import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(@Body() data: Project): Promise<Project> {
    return this.projectService.createProject(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProjects(): Promise<Project[]> {
    return this.projectService.getProjects();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<Project | null> {
    return this.projectService.getProjectById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProject(@Param('id') id: string, @Body() data: Project): Promise<Project> {
    return this.projectService.updateProject(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProject(@Param('id') id: string): Promise<Project> {
    return this.projectService.deleteProject(id);
  }
}
