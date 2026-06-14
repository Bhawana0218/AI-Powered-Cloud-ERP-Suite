import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  @Get()
  getAll(@Request() req, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.projects.getProjects(req.user.companyId, page || 1, limit || 20);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.projects.getProject(id);
  }

  @Post()
  create(@Request() req, @Body() dto: any) {
    return this.projects.createProject({ ...dto, companyId: req.user.companyId, ownerId: req.user.id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.projects.updateProject(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projects.deleteProject(id);
  }

@Get(':id/tasks')
getTasks(@Param('id') id: string) {
  return this.projects.getTasks(id);
}
  @Post('tasks')
  createTask(@Request() req, @Body() dto: any) {
    return this.projects.createTask({ ...dto, creatorId: req.user.id });
  }

  @Patch('tasks/:id')
  updateTask(@Param('id') id: string, @Body() dto: any) {
    return this.projects.updateTask(id, dto);
  }
}
