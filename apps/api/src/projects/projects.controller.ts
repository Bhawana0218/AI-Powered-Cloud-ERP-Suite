import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProjectDto, UpdateProjectDto, CreateTaskDto, UpdateTaskDto } from './dto/project.dto';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN', 'MANAGER', 'STAFF')
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
  create(@Request() req, @Body() dto: CreateProjectDto) {
    return this.projects.createProject({ ...dto, companyId: req.user.companyId, ownerId: req.user.id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projects.updateProject(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projects.deleteProject(id);
  }

  @Get('tasks')
  getTasks(@Request() req, @Query('projectId') projectId?: string) {
    return this.projects.getTasks(req.user.companyId, projectId);
  }

  @Get('tasks/:id')
  getTask(@Param('id') id: string) {
    return this.projects.getTask(id);
  }

  @Post('tasks')
  createTask(@Request() req, @Body() dto: CreateTaskDto) {
    return this.projects.createTask({ ...dto, creatorId: req.user.id });
  }

  @Patch('tasks/:id')
  updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.projects.updateTask(id, dto);
  }

  @Delete('tasks/:id')
  deleteTask(@Param('id') id: string) {
    return this.projects.deleteTask(id);
  }
}
