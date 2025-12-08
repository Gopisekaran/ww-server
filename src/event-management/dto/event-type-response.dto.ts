import { Expose, Transform, Type } from 'class-transformer';
import { BadgeLiteDto, EventListResponseDto } from './event-list-response.dto';

export class EventTypeResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  @Type(() => BadgeLiteDto)
  badge?: BadgeLiteDto;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  @Transform(({ obj }) => obj.events?.length ?? 0)
  events!: number;
}

export class EventTypeAndEventsDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  @Type(() => BadgeLiteDto)
  badge?: BadgeLiteDto;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  @Type(() => EventListResponseDto)
  events!: EventListResponseDto[];
}
