import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateNotificationDto {
  @IsString() title: string;
  @IsString() message: string;
  @IsOptional() @IsString() type?: string;
  @IsString() userId: string;
}
