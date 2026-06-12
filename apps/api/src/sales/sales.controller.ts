import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN', 'MANAGER', 'STAFF')
@Controller('sales')
export class SalesController {
  constructor(private sales: SalesService) {}

  @Get('products')
  getProducts(@Request() req, @Query('search') search?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.sales.getProducts(req.user.companyId, search, page || 1, limit || 20);
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.sales.getProduct(id);
  }

  @Post('products')
  createProduct(@Request() req, @Body() dto: CreateProductDto) {
    return this.sales.createProduct({ ...dto, companyId: req.user.companyId });
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.sales.updateProduct(id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.sales.deleteProduct(id);
  }

  @Get('invoices')
  getInvoices(@Request() req, @Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.sales.getInvoices(req.user.companyId, status, page || 1, limit || 20);
  }

  @Get('invoices/:id')
  getInvoice(@Param('id') id: string) {
    return this.sales.getInvoice(id);
  }

  @Post('invoices')
  createInvoice(@Request() req, @Body() dto: CreateInvoiceDto) {
    return this.sales.createInvoice({ ...dto, companyId: req.user.companyId, ownerId: req.user.id });
  }

  @Patch('invoices/:id')
  updateInvoice(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.sales.updateInvoice(id, dto);
  }

  @Delete('invoices/:id')
  deleteInvoice(@Param('id') id: string) {
    return this.sales.deleteInvoice(id);
  }

  @Get('inventory')
  getInventory(@Request() req) {
    return this.sales.getInventory(req.user.companyId);
  }
}
