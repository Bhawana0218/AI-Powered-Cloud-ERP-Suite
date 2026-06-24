import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  async getDepartment(id: string) {
    const dept = await this.prisma.department.findUnique({
      where: { id },
      include: { _count: { select: { employees: true } }, employees: { select: { id: true, firstName: true, lastName: true, position: true } } },
    });
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async updateDepartment(id: string, data: { name?: string }) {
    const dept = await this.prisma.department.findUnique({ where: { id } });
    if (!dept) throw new NotFoundException('Department not found');
    return this.prisma.department.update({ where: { id }, data });
  }

  async getDepartments(companyId: string) {
    return this.prisma.department.findMany({
      where: { companyId },
      include: { _count: { select: { employees: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async createDepartment(data: { name: string; companyId: string }) {
    return this.prisma.department.create({ data });
  }

  async deleteDepartment(id: string) {
    const dept = await this.prisma.department.findUnique({ where: { id } });
    if (!dept) throw new NotFoundException('Department not found');
    await this.prisma.department.delete({ where: { id } });
    return { deleted: true };
  }

  async getEmployees(companyId: string, search?: string, departmentId?: string, page = 1, limit = 20) {
    const where: any = { companyId };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (departmentId) where.departmentId = departmentId;
    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({
        where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
        include: { department: { select: { id: true, name: true } } },
      }),
      this.prisma.employee.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async getEmployee(id: string) {
    const emp = await this.prisma.employee.findUnique({
      where: { id },
      include: { department: { select: { id: true, name: true } } },
    });
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }

  async createEmployee(data: any) {
    const { hireDate, departmentId, ...rest } = data;
    return this.prisma.employee.create({
      data: { ...rest, departmentId: departmentId || undefined, hireDate: hireDate ? new Date(hireDate) : undefined },
    });
  }

  async updateEmployee(id: string, data: any) {
    const emp = await this.prisma.employee.findUnique({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');
    const { hireDate, departmentId, ...rest } = data;
    return this.prisma.employee.update({
      where: { id },
      data: { ...rest, departmentId: departmentId || undefined, hireDate: hireDate ? new Date(hireDate) : undefined },
    });
  }

  async deleteEmployee(id: string) {
    const emp = await this.prisma.employee.findUnique({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');
    await this.prisma.employee.delete({ where: { id } });
    return { deleted: true };
  }
}
