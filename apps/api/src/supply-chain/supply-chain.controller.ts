import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SupplyChainService } from './supply-chain.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateVendorDto, UpdateVendorDto, CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './dto/supply-chain.dto';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN', 'MANAGER', 'STAFF')
@Controller('supply-chain')
export class SupplyChainController {
  constructor(private supplyChain: SupplyChainService) {}

  @Get('stats')
  getStats(@Request() req) {
    return this.supplyChain.getStats(req.user.companyId);
  }

  @Get('vendors')
  getVendors(@Request() req) {
    return this.supplyChain.getVendors(req.user.companyId);
  }

  @Get('vendors/:id')
  getVendor(@Param('id') id: string, @Request() req) {
    return this.supplyChain.getVendor(id, req.user.companyId);
  }

  @Post('vendors')
  createVendor(@Request() req, @Body() dto: CreateVendorDto) {
    return this.supplyChain.createVendor({ ...dto, companyId: req.user.companyId });
  }

  @Patch('vendors/:id')
  updateVendor(@Param('id') id: string, @Body() dto: UpdateVendorDto) {
    return this.supplyChain.updateVendor(id, dto);
  }

  @Delete('vendors/:id')
  deleteVendor(@Param('id') id: string) {
    return this.supplyChain.deleteVendor(id);
  }

  @Get('purchase-orders')
  getOrders(@Request() req, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.supplyChain.getPurchaseOrders(req.user.companyId, page || 1, limit || 20);
  }

  @Get('purchase-orders/:id')
  getOrder(@Param('id') id: string, @Request() req) {
    return this.supplyChain.getPurchaseOrder(id, req.user.companyId);
  }

  @Post('purchase-orders')
  createOrder(@Request() req, @Body() dto: CreatePurchaseOrderDto) {
    return this.supplyChain.createPurchaseOrder({ ...dto, companyId: req.user.companyId });
  }

  @Patch('purchase-orders/:id')
  updateOrder(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderDto) {
    return this.supplyChain.updatePurchaseOrder(id, dto);
  }

  @Delete('purchase-orders/:id')
  deleteOrder(@Param('id') id: string) {
    return this.supplyChain.deletePurchaseOrder(id);
  }
}
