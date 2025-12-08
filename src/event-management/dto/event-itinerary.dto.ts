import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class EventItineraryDto {
  @IsDateString()
  date!: string;

  @IsString()
  @MaxLength(100)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mapLinks?: string[];

  @IsOptional()
  @IsNumber()
  kmToCover?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  dayOrder?: number;
}
