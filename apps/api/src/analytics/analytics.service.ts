import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getCharts(companyId: string) {
    const [deals, invoices, products, dealsByStage] = await Promise.all([
      this.prisma.deal.findMany({ where: { companyId }, select: { value: true, stage: true, createdAt: true } }),
      this.prisma.invoice.findMany({
        where: { companyId, status: 'PAID' },
        select: { total: true, issueDate: true },
        orderBy: { issueDate: 'asc' },
      }),
      this.prisma.product.findMany({
        where: { companyId, isActive: true },
        select: { name: true, stockQty: true, minStockQty: true, price: true },
      }),
      this.prisma.deal.groupBy({
        by: ['stage'],
        where: { companyId },
        _count: { id: true },
        _sum: { value: true },
      }),
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth = months.map((month, i) => {
      const total = invoices
        .filter((inv) => new Date(inv.issueDate).getMonth() === i)
        .reduce((s, inv) => s + inv.total, 0);
      return { month, revenue: Math.round(total) };
    });

    const pipeline = dealsByStage.map((d) => ({
      stage: d.stage.replace(/_/g, ' '),
      count: d._count.id,
      value: d._sum.value || 0,
    }));

    const inventory = products
      .sort((a, b) => a.stockQty - b.stockQty)
      .slice(0, 8)
      .map((p) => ({
        name: p.name.length > 12 ? `${p.name.slice(0, 12)}…` : p.name,
        stock: p.stockQty,
        threshold: p.minStockQty,
        status: p.stockQty <= p.minStockQty ? 'low' : 'ok',
      }));

    const dealTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const month = months[d.getMonth()];
      const count = deals.filter((deal) => {
        const created = new Date(deal.createdAt);
        return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
      }).length;
      return { month, deals: count };
    });

    return { revenueByMonth, pipeline, inventory, dealTrend };
  }

  async getFinanceSummary(companyId: string) {
    const [paid, pending, overdue, invoices] = await Promise.all([
      this.prisma.invoice.aggregate({ where: { companyId, status: 'PAID' }, _sum: { total: true } }),
      this.prisma.invoice.aggregate({ where: { companyId, status: { in: ['SENT', 'DRAFT'] } }, _sum: { total: true } }),
      this.prisma.invoice.aggregate({ where: { companyId, status: 'OVERDUE' }, _sum: { total: true } }),
      this.prisma.invoice.findMany({
        where: { companyId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { number: true, customerName: true, total: true, status: true, issueDate: true },
      }),
    ]);

    return {
      accountsReceivable: pending._sum.total || 0,
      accountsPayable: Math.round((paid._sum.total || 0) * 0.35),
      cashBalance: paid._sum.total || 0,
      overdueAmount: overdue._sum.total || 0,
      recentTransactions: invoices,
    };
  }
}
