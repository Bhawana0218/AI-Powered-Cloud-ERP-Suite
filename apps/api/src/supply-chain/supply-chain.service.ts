import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupplyChainService {
  constructor(private prisma: PrismaService) {}

  async getVendors(companyId: string) {
    return this.prisma.vendor.findMany({
      where: { companyId, isActive: true },
      orderBy: { name: 'asc' },
      include: { _count: { select: { purchaseOrders: true } } },
    });
  }

  async createVendor(data: { name: string; email?: string; phone?: string; address?: string; companyId: string }) {
    return this.prisma.vendor.create({ data });
  }

  async getPurchaseOrders(companyId: string, page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where: { companyId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { vendor: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.purchaseOrder.count({ where: { companyId } }),
    ]);
    return { data, total, page, limit };
  }

  async createPurchaseOrder(data: {
    vendorId: string;
    companyId: string;
    total: number;
    notes?: string;
    expectedAt?: string;
  }) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id: data.vendorId, companyId: data.companyId },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');

    const number = `PO-${Date.now()}`;
    return this.prisma.purchaseOrder.create({
      data: {
        number,
        vendorId: data.vendorId,
        companyId: data.companyId,
        total: data.total,
        notes: data.notes,
        expectedAt: data.expectedAt ? new Date(data.expectedAt) : undefined,
        status: 'SENT',
      },
      include: { vendor: true },
    });
  }

  async getStats(companyId: string) {
    const [vendors, orders, pending, received] = await Promise.all([
      this.prisma.vendor.count({ where: { companyId, isActive: true } }),
      this.prisma.purchaseOrder.count({ where: { companyId } }),
      this.prisma.purchaseOrder.count({ where: { companyId, status: { in: ['DRAFT', 'SENT'] } } }),
      this.prisma.purchaseOrder.count({ where: { companyId, status: 'RECEIVED' } }),
    ]);
    const products = await this.prisma.product.findMany({
      where: { companyId, isActive: true },
      select: { stockQty: true, minStockQty: true },
    });
    const lowStockCount = products.filter((p) => p.stockQty <= p.minStockQty).length;

    return { vendors, orders, pending, received, lowStockCount };
  }
}
