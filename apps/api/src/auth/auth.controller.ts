import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: { email: string; password: string; firstName?: string; lastName?: string }) {
    const result = await this.auth.register(dto.email, dto.password, dto.firstName, dto.lastName);
    return { ...result, email: dto.email };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: { email: string; password: string }) {
    const result = await this.auth.login(dto.email, dto.password);
    return { ...result, email: dto.email };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return this.auth.getProfile(req.user.id);
  }
}
