import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN', 'MANAGER', 'STAFF')
@Controller('companies')
export class CompanyController {
  constructor(private company: CompanyService) {}

  @Get()
  @Roles('SUPER_ADMIN')
  getAll() {
    return this.company.findAll();
  }

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Request() req, @Body() dto: CreateCompanyDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.company.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  delete(@Param('id') id: string) {
    return this.company.delete(id);
  }
}
