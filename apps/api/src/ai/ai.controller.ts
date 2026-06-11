import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private ai: AiService) {}

  @Get('forecast')
  getForecast(@Request() req) {
    return this.ai.getDemandForecast(req.user.companyId);
  }

  @Get('insights')
  getInsights(@Request() req) {
    return this.ai.getInsights(req.user.companyId);
  }
}
