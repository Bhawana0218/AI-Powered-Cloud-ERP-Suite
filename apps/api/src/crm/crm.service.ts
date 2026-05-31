import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  async getContacts(companyId: string, search?: string, page = 1, limit = 20) {
    const where: any = { companyId };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { id: true, firstName: true, lastName: true, email: true } } },
      }),
      this.prisma.contact.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async createContact(data: {
    firstName: string; lastName: string; email?: string; phone?: string;
    jobTitle?: string; companyId: string; ownerId?: string; source?: string; notes?: string;
  }) {
    return this.prisma.contact.create({ data });
  }

  async updateContact(id: string, data: any) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    return this.prisma.contact.update({ where: { id }, data });
  }

  async deleteContact(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    await this.prisma.contact.delete({ where: { id } });
    return { deleted: true };
  }

  async getDeals(companyId: string, stage?: string, page = 1, limit = 20) {
    const where: any = { companyId };
    if (stage) where.stage = stage;
    const [data, total] = await Promise.all([
      this.prisma.deal.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          contact: { select: { id: true, firstName: true, lastName: true } },
          owner: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
      this.prisma.deal.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async createDeal(data: {
    title: string; value?: number; stage?: string; probability?: number;
    closeDate?: string; contactId?: string; companyId: string; ownerId?: string; notes?: string;
  }) {
    return this.prisma.deal.create({ data: data as any });
  }

  async updateDeal(id: string, data: any) {
    const deal = await this.prisma.deal.findUnique({ where: { id } });
    if (!deal) throw new NotFoundException('Deal not found');
    return this.prisma.deal.update({ where: { id }, data });
  }

  async getPipeline(companyId: string) {
    const stages = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];
    const pipeline = await Promise.all(
      stages.map(async (stage) => {
        const deals = await this.prisma.deal.findMany({
          where: { companyId, stage: stage as any },
          include: {
            contact: { select: { id: true, firstName: true, lastName: true } },
            owner: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { updatedAt: 'desc' },
        });
        const total = deals.reduce((sum, d) => sum + d.value, 0);
        return { stage, deals, total, count: deals.length };
      }),
    );
    return pipeline;
  }
}
