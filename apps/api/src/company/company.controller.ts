import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN', 'MANAGER', 'STAFF')
@Controller('companies')
export class CompanyController {
  constructor(private company: CompanyService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Request() req, @Body() dto: { name: string; slug: string; industry?: string; size?: string }) {
    return this.company.create({ ...dto, ownerId: req.user.id });
  }

  @Get('me')
  getMyCompany(@Request() req) {
    return this.company.findByOwner(req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.company.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { name?: string; website?: string; industry?: string; size?: string; address?: string; phone?: string }) {
    return this.company.update(id, dto);
  }
}
