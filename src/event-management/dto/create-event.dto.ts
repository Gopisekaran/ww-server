import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMilitaryTime,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventItineraryDto } from './event-itinerary.dto';

export class CreateEventDto {
  @IsString()
  title!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsMilitaryTime()
  time!: string;

  @IsString()
  agenda!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  mapLink?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  isCancelled?: boolean;

  @IsOptional()
  @IsBoolean()
  isAborted?: boolean;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsUUID()
  eventTypeId!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventItineraryDto)
  itineraries?: EventItineraryDto[];
}
