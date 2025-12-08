// dto/create-region.dto.ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
