import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEventTypeDto {
  @IsString()
  @MaxLength(50)
  name!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
