import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
}
