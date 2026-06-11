import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    companyName?: string,
  ) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(password, 10);
    const slugBase = (companyName || email.split('@')[0] || 'company')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        role: 'ADMIN',
        createdCompanies: {
          create: {
            name: companyName || `${firstName || 'My'}'s Company`,
            slug,
          },
        },
      },
      include: { createdCompanies: true },
    });

    const company = user.createdCompanies[0];
    if (company) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { companyId: company.id },
      });
    }

    return this.signToken(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user.id, user.email);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, companyId: true, avatar: true },
    });
    return user;
  }

  private signToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwt.sign(payload, { expiresIn: '7d' }),
      refreshToken: this.jwt.sign(payload, { expiresIn: '30d' }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken);
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || !user.isActive) throw new UnauthorizedException();
      return this.signToken(user.id, user.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
