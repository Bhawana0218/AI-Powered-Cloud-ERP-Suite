import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CrmService } from './crm.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';
import { CreateDealDto, UpdateDealDto } from './dto/deal.dto';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN', 'MANAGER', 'STAFF')
@Controller('crm')
export class CrmController {
  constructor(private crm: CrmService) {}

  @Get('contacts')
  getContacts(@Request() req, @Query('search') search?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.crm.getContacts(req.user.companyId, search, page || 1, limit || 20);
  }

  @Get('contacts/:id')
  getContact(@Param('id') id: string) {
    return this.crm.getContact(id);
  }

  @Post('contacts')
  createContact(@Request() req, @Body() dto: CreateContactDto) {
    return this.crm.createContact({ ...dto, companyId: req.user.companyId, ownerId: req.user.id });
  }

  @Patch('contacts/:id')
  updateContact(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.crm.updateContact(id, dto);
  }

  @Delete('contacts/:id')
  deleteContact(@Param('id') id: string) {
    return this.crm.deleteContact(id);
  }

  @Get('deals')
  getDeals(@Request() req, @Query('stage') stage?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.crm.getDeals(req.user.companyId, stage, page || 1, limit || 20);
  }

  @Get('deals/:id')
  getDeal(@Param('id') id: string) {
    return this.crm.getDeal(id);
  }

  @Post('deals')
  createDeal(@Request() req, @Body() dto: CreateDealDto) {
    return this.crm.createDeal({ ...dto, companyId: req.user.companyId, ownerId: req.user.id });
  }

  @Patch('deals/:id')
  updateDeal(@Param('id') id: string, @Body() dto: UpdateDealDto) {
    return this.crm.updateDeal(id, dto);
  }

  @Delete('deals/:id')
  deleteDeal(@Param('id') id: string) {
    return this.crm.deleteDeal(id);
  }

  @Get('pipeline')
  getPipeline(@Request() req) {
    return this.crm.getPipeline(req.user.companyId);
  }
}
