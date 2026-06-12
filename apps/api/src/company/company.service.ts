import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { members: true } } },
    });
  }

  async create(data: { name: string; slug: string; ownerId: string; industry?: string; size?: string }) {
    if (!data.name?.trim()) throw new BadRequestException('Company name is required');
    if (!data.slug?.trim()) throw new BadRequestException('Company slug is required');
    const existing = await this.prisma.company.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictException('Company slug already exists');
    const company = await this.prisma.company.create({
      data: { name: data.name, slug: data.slug, ownerId: data.ownerId, industry: data.industry, size: data.size },
    });
    await this.prisma.user.update({ where: { id: data.ownerId }, data: { companyId: company.id, role: 'ADMIN' } });
    return company;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.company.findFirst({
      where: { ownerId },
      include: { _count: { select: { members: true, contacts: true, deals: true, products: true, invoices: true, projects: true } } },
    });
  }

  async findById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { _count: { select: { members: true, contacts: true, deals: true, products: true, invoices: true, projects: true } } },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, data: { name?: string; website?: string; industry?: string; size?: string; address?: string; phone?: string; logo?: string }) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return this.prisma.company.update({ where: { id }, data });
  }

  async delete(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    await this.prisma.company.delete({ where: { id } });
    return { deleted: true };
  }
}
