import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)
@Roles('ADMIN', 'MANAGER', 'STAFF')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analytics: AnalyticsService) {}

  @Get('charts')
  getCharts(@Request() req) {
    return this.analytics.getCharts(req.user.companyId);
  }

  @Get('finance')
  getFinance(@Request() req) {
    return this.analytics.getFinanceSummary(req.user.companyId);
  }
}
