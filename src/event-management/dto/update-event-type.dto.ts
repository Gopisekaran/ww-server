import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateEventTypeDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
