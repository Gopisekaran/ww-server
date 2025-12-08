import { Expose, Transform, Type } from 'class-transformer';

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

export class BikerPublicDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  profileImage!: string;

  @Expose()
  residing!: string;

  @Expose()
  bikeNameAndModel!: string;

  @Expose()
  mobileNumber!: string;
}

export class ParticipantDetailedDto {
  @Expose()
  id!: string;

  @Expose()
  @Type(() => BikerPublicDto)
  biker!: BikerPublicDto;

  // Populated conditionally (admin/moderator views)
  @Expose()
  paidAmount?: number;

  @Expose()
  hasParticipated?: boolean;
}

export class ItineraryDto {
  @Expose()
  id!: string;

  @Expose()
  date!: Date;

  @Expose()
  title!: string;

  @Expose()
  description?: string;

  @Expose()
  mapLinks?: string[];

  @Expose()
  kmToCover?: number;

  @Expose()
  dayOrder!: number;
}

export class EventDetailsDTO {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  agenda!: string;

  @Expose()
  description!: string;

  @Expose()
  location?: string;

  @Expose()
  mapLink?: string;

  @Expose()
  startDate!: Date;

  @Expose()
  endDate!: Date;

  @Expose()
  time!: string;

  @Expose()
  price!: number;

  @Expose()
  @Type(() => EventTypeLiteDto)
  eventType!: EventTypeLiteDto;

  @Expose()
  @Type(() => BadgeLiteDto)
  badge?: BadgeLiteDto;

  @Expose()
  @Type(() => BikerPublicDto)
  createdUser!: BikerPublicDto;

  @Expose()
  @Type(() => ItineraryDto)
  itineraries!: ItineraryDto[];

  @Expose()
  @Type(() => ParticipantDetailedDto)
  participants!: ParticipantDetailedDto[];

  @Expose()
  @Transform(({ obj }) => obj.participants?.length ?? 0)
  participantsCount!: number;
}
