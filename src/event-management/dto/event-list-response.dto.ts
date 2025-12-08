import { Expose, Transform, Type } from 'class-transformer';

export class BikerProfileDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;
}

export class BadgeLiteDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  iconUrl!: string;
}

export class EventTypeLiteDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  @Type(() => BadgeLiteDto)
  badge?: BadgeLiteDto;
}

export class EventListResponseDto {
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
  price!: number;

  @Expose()
  @Type(() => BikerProfileDto)
  createdUser!: BikerProfileDto;

  @Expose()
  @Transform(({ obj }) => obj.participants?.length ?? 0)
  participantsCount!: number;

  // Badges (event-level badge and type-level badge)
  @Expose()
  @Type(() => BadgeLiteDto)
  badge?: BadgeLiteDto;
}
