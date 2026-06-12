import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateVendorDto {
  @IsString() name: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsNumber() @Min(0) rating?: number;
}

export class UpdateVendorDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsNumber() @Min(0) rating?: number;
}

export class CreatePurchaseOrderDto {
  @IsString() vendorId: string;
  @IsOptional() @IsNumber() @Min(0) total?: number;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() expectedAt?: string;
}

export class UpdatePurchaseOrderDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsNumber() @Min(0) total?: number;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() expectedAt?: string;
}
