import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateEmployeeDto, UpdateEmployeeDto, CreateDepartmentDto, UpdateDepartmentDto } from './dto/employee.dto';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN', 'MANAGER', 'STAFF')
@Controller('hr')
export class HrController {
  constructor(private hr: HrService) {}

  @Get('departments')
  getDepartments(@Request() req) {
    return this.hr.getDepartments(req.user.companyId);
  }

  @Get('departments/:id')
  getDepartment(@Param('id') id: string) {
    return this.hr.getDepartment(id);
  }

  @Post('departments')
  createDepartment(@Request() req, @Body() dto: CreateDepartmentDto) {
    return this.hr.createDepartment({ ...dto, companyId: req.user.companyId });
  }

  @Patch('departments/:id')
  updateDepartment(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.hr.updateDepartment(id, dto);
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

  @Get('employees/:id')
  getEmployee(@Param('id') id: string) {
    return this.hr.getEmployee(id);
  }

  @Post('employees')
  createEmployee(@Request() req, @Body() dto: CreateEmployeeDto) {
    return this.hr.createEmployee({ ...dto, companyId: req.user.companyId });
  }

  @Patch('employees/:id')
  updateEmployee(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.hr.updateEmployee(id, dto);
  }

  @Delete('employees/:id')
  deleteEmployee(@Param('id') id: string) {
    return this.hr.deleteEmployee(id);
  }
}
