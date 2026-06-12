import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getCompanyUsers(currentUserId: string) {
    const currentUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
    if (!currentUser || !currentUser.companyId) {
      throw new ForbiddenException('Not associated with a company');
    }
    const users = await this.prisma.user.findMany({
      where: { companyId: currentUser.companyId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return { users, companyId: currentUser.companyId };
  }

  async updateRole(targetUserId: string, newRole: string, currentUserId: string) {
    const validRoles = ['ADMIN', 'MANAGER', 'STAFF', 'SUPER_ADMIN'];
    if (!validRoles.includes(newRole)) {
      throw new BadRequestException(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const currentUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });
    if (!currentUser) throw new NotFoundException('Current user not found');

    const targetUser = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) throw new NotFoundException('User not found');

    if (currentUser.companyId !== targetUser.companyId && currentUser.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot manage users in other companies');
    }
    if (currentUser.role !== 'SUPER_ADMIN' && newRole === 'SUPER_ADMIN') {
      throw new ForbiddenException('Only SUPER_ADMIN can assign SUPER_ADMIN');
    }
    if (currentUser.role !== 'SUPER_ADMIN' && targetUser.role === 'SUPER_ADMIN') {
      throw new ForbiddenException('Cannot modify SUPER_ADMIN users');
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole as any },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    return updated;
  }
}
