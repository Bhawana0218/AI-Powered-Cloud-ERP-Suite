import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('hr')
export class HrController {
  constructor(private hr: HrService) {}

  @Get('departments')
  getDepartments(@Request() req) {
    return this.hr.getDepartments(req.user.companyId);
  }

  @Post('departments')
  createDepartment(@Request() req, @Body() dto: { name: string }) {
    return this.hr.createDepartment({ ...dto, companyId: req.user.companyId });
  }

  @Delete('departments/:id')
  deleteDepartment(@Param('id') id: string) {
    return this.hr.deleteDepartment(id);
  }

  @Get('employees')
  getEmployees(
    @Request() req, @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
    @Query('page') page?: number, @Query('limit') limit?: number,
  ) {
    return this.hr.getEmployees(req.user.companyId, search, departmentId, page || 1, limit || 20);
  }

  @Post('employees')
  createEmployee(@Request() req, @Body() dto: any) {
    return this.hr.createEmployee({ ...dto, companyId: req.user.companyId });
  }

  @Patch('employees/:id')
  updateEmployee(@Param('id') id: string, @Body() dto: any) {
    return this.hr.updateEmployee(id, dto);
  }

  @Delete('employees/:id')
  deleteEmployee(@Param('id') id: string) {
    return this.hr.deleteEmployee(id);
  }
}
