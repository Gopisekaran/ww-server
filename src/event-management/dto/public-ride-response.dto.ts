import { Expose, Transform, Type } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';
import {
  BadgeLiteDto,
  BikerProfileDto,
  EventTypeLiteDto,
} from './event-list-response.dto';

export class PublicRideFilterDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class PublicRideListResponseDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  @Type(() => EventTypeLiteDto)
  eventType!: EventTypeLiteDto;

  @Expose()
  startDate!: Date;

  @Expose()
  endDate!: Date;

  @Expose()
  time!: string;

  @Expose()
  isCompleted!: boolean;

  @Expose()
  @Type(() => BikerProfileDto)
  createdUser!: BikerProfileDto;

  @Expose()
  @Transform(({ obj }) => obj.participants?.length ?? 0)
  participantsCount!: number;

  @Expose()
  @Type(() => BadgeLiteDto)
  badge?: BadgeLiteDto;
}
