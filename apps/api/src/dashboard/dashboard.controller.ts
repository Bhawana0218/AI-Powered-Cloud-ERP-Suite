import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN', 'MANAGER', 'STAFF')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboard: DashboardService) {}

  @Get('stats')
  getStats(@Request() req) {
    return this.dashboard.getStats(req.user.companyId);
  }

  @Get('activity')
  getRecentActivity(@Request() req) {
    return this.dashboard.getRecentActivity(req.user.companyId);
  }

  @Get('overview')
  getOverview(@Request() req) {
    return this.dashboard.getOverview(req.user.companyId);
  }
}
