import { Controller, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('company')
  getCompanyUsers(@Request() req) {
    return this.users.getCompanyUsers(req.user.id);
  }

  @Patch(':id/role')
  @Roles('ADMIN', 'SUPER_ADMIN')
  updateRole(@Param('id') id: string, @Body() dto: { role: string }, @Request() req) {
    return this.users.updateRole(id, dto.role, req.user.id);
  }
}
