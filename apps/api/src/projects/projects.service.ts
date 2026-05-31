import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getProjects(companyId: string, page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where: { companyId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          owner: { select: { id: true, firstName: true, lastName: true } },
          _count: { select: { tasks: true } },
        },
      }),
      this.prisma.project.count({ where: { companyId } }),
    ]);
    return { data, total, page, limit };
  }

  async createProject(data: { name: string; description?: string; startDate?: string; endDate?: string; budget?: number; companyId: string; ownerId?: string }) {
    return this.prisma.project.create({ data });
  }

  async getProject(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true } },
        tasks: {
          orderBy: { createdAt: 'desc' },
          include: {
            assignee: { select: { id: true, firstName: true, lastName: true } },
            creator: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async updateProject(id: string, data: any) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return this.prisma.project.update({ where: { id }, data });
  }

  async createTask(data: {
    title: string; description?: string; status?: string; priority?: string;
    dueDate?: string; projectId: string; assigneeId?: string; creatorId?: string;
  }) {
    return this.prisma.task.create({ data: data as any });
  }

  async updateTask(id: string, data: any) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return this.prisma.task.update({ where: { id }, data });
  }

  async deleteProject(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    await this.prisma.project.delete({ where: { id } });
    return { deleted: true };
  }
}
