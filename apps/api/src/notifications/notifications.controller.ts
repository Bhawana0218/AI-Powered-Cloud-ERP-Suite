import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  getAll(@Request() req) {
    return this.notifications.getAll(req.user.id);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.notifications.getUnreadCount(req.user.id);
  }

  @Patch('read-all')
  markAllRead(@Request() req) {
    return this.notifications.markAllRead(req.user.id);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Request() req) {
    return this.notifications.markRead(id, req.user.id);
  }
}
