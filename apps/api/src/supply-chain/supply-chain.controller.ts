import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { SupplyChainService } from './supply-chain.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

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

  @Post('vendors')
  createVendor(@Request() req, @Body() dto: { name: string; email?: string; phone?: string; address?: string }) {
    return this.supplyChain.createVendor({ ...dto, companyId: req.user.companyId });
  }

  @Get('purchase-orders')
  getOrders(@Request() req, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.supplyChain.getPurchaseOrders(req.user.companyId, page || 1, limit || 20);
  }

  @Post('purchase-orders')
  createOrder(
    @Request() req,
    @Body() dto: { vendorId: string; total: number; notes?: string; expectedAt?: string },
  ) {
    return this.supplyChain.createPurchaseOrder({ ...dto, companyId: req.user.companyId });
  }
}
