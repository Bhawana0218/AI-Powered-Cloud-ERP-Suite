import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(companyId: string) {
    const [
      contactsCount, dealsCount, dealsWon, pipelineValue,
      productsCount, invoicesCount, revenue, invoicesOverdue,
      employeesCount, projectsCount, activeProjects,
    ] = await Promise.all([
      this.prisma.contact.count({ where: { companyId } }),
      this.prisma.deal.count({ where: { companyId } }),
      this.prisma.deal.count({ where: { companyId, stage: 'CLOSED_WON' } }),
      this.prisma.deal.aggregate({ where: { companyId, stage: { not: 'CLOSED_LOST' } }, _sum: { value: true } }),
      this.prisma.product.count({ where: { companyId, isActive: true } }),
      this.prisma.invoice.count({ where: { companyId } }),
      this.prisma.invoice.aggregate({ where: { companyId, status: 'PAID' }, _sum: { total: true } }),
      this.prisma.invoice.count({ where: { companyId, status: 'OVERDUE' } }),
      this.prisma.employee.count({ where: { companyId, isActive: true } }),
      this.prisma.project.count({ where: { companyId } }),
      this.prisma.project.count({ where: { companyId, status: 'active' } }),
    ]);

    return {
      contactsCount,
      dealsCount,
      dealsWon,
      pipelineValue: pipelineValue._sum.value || 0,
      productsCount,
      invoicesCount,
      revenue: revenue._sum.total || 0,
      invoicesOverdue,
      employeesCount,
      projectsCount,
      activeProjects,
    };
  }

  async getRecentActivity(companyId: string) {
    const [recentDeals, recentInvoices, recentProjects, recentContacts] = await Promise.all([
      this.prisma.deal.findMany({ where: { companyId }, take: 5, orderBy: { updatedAt: 'desc' }, select: { id: true, title: true, value: true, stage: true, updatedAt: true } }),
      this.prisma.invoice.findMany({ where: { companyId }, take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, number: true, total: true, status: true, createdAt: true } }),
      this.prisma.project.findMany({ where: { companyId }, take: 5, orderBy: { updatedAt: 'desc' }, select: { id: true, name: true, status: true, updatedAt: true } }),
      this.prisma.contact.findMany({ where: { companyId }, take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, firstName: true, lastName: true, email: true, createdAt: true } }),
    ]);

    return { recentDeals, recentInvoices, recentProjects, recentContacts };
  }

  async getOverview(companyId: string) {
    const stats = await this.getStats(companyId);
    const activity = await this.getRecentActivity(companyId);
    return { ...stats, ...activity };
  }
}
