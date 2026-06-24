import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getTasks(companyId: string, projectId?: string) {
    const where: any = { project: { companyId } };
    if (projectId) where.projectId = projectId;
    return this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, firstName: true, lastName: true } },
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async getTask(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, firstName: true, lastName: true } },
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async deleteTask(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    await this.prisma.task.delete({ where: { id } });
    return { deleted: true };
  }

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
    const { startDate, endDate, ...rest } = data;
    return this.prisma.project.create({
      data: { ...rest, startDate: startDate ? new Date(startDate) : undefined, endDate: endDate ? new Date(endDate) : undefined },
    });
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
    const { startDate, endDate, ...rest } = data;
    return this.prisma.project.update({
      where: { id },
      data: { ...rest, startDate: startDate ? new Date(startDate) : undefined, endDate: endDate ? new Date(endDate) : undefined } as any,
    });
  }

  async createTask(data: {
    title: string; description?: string; status?: string; priority?: string;
    dueDate?: string; projectId: string; assigneeId?: string; creatorId?: string;
  }) {
    const { dueDate, ...rest } = data;
    return this.prisma.task.create({
      data: { ...rest, dueDate: dueDate ? new Date(dueDate) : undefined } as any,
    });
  }

  async updateTask(id: string, data: any) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    const { dueDate, ...rest } = data;
    return this.prisma.task.update({
      where: { id },
      data: { ...rest, dueDate: dueDate ? new Date(dueDate) : undefined },
    });
  }

  async deleteProject(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    await this.prisma.project.delete({ where: { id } });
    return { deleted: true };
  }
}
