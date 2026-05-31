import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private sales: SalesService) {}

  @Get('products')
  getProducts(@Request() req, @Query('search') search?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.sales.getProducts(req.user.companyId, search, page || 1, limit || 20);
  }

  @Post('products')
  createProduct(@Request() req, @Body() dto: any) {
    return this.sales.createProduct({ ...dto, companyId: req.user.companyId });
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: any) {
    return this.sales.updateProduct(id, dto);
  }

  @Get('invoices')
  getInvoices(@Request() req, @Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.sales.getInvoices(req.user.companyId, status, page || 1, limit || 20);
  }

  @Post('invoices')
  createInvoice(@Request() req, @Body() dto: any) {
    return this.sales.createInvoice({ ...dto, companyId: req.user.companyId, ownerId: req.user.id });
  }

  @Get('inventory')
  getInventory(@Request() req) {
    return this.sales.getInventory(req.user.companyId);
  }
}
