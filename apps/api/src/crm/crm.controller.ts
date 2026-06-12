import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CrmService } from './crm.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN', 'MANAGER', 'STAFF')
@Controller('crm')
export class CrmController {
  constructor(private crm: CrmService) {}

  @Get('contacts')
  getContacts(@Request() req, @Query('search') search?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.crm.getContacts(req.user.companyId, search, page || 1, limit || 20);
  }

  @Post('contacts')
  createContact(@Request() req, @Body() dto: any) {
    return this.crm.createContact({ ...dto, companyId: req.user.companyId, ownerId: req.user.id });
  }

  @Patch('contacts/:id')
  updateContact(@Param('id') id: string, @Body() dto: any) {
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

  @Post('deals')
  createDeal(@Request() req, @Body() dto: any) {
    return this.crm.createDeal({ ...dto, companyId: req.user.companyId, ownerId: req.user.id });
  }

  @Patch('deals/:id')
  updateDeal(@Param('id') id: string, @Body() dto: any) {
    return this.crm.updateDeal(id, dto);
  }

  @Get('pipeline')
  getPipeline(@Request() req) {
    return this.crm.getPipeline(req.user.companyId);
  }
}
