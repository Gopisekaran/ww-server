import { Expose, Type } from 'class-transformer';

export class RideTypeMinimalDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string | null;
}

export class RideEventMinimalDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string | null;
}

export class BadgeListDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  iconUrl: string;

  @Expose()
  category: string;

  @Expose()
  rideEventId?: string | null;

  @Expose()
  rideTypeId?: string | null;

  @Expose()
  isRepeatable: boolean;

  @Expose()
  @Type(() => RideTypeMinimalDto)
  rideType?: RideTypeMinimalDto | null;

  @Expose()
  @Type(() => RideEventMinimalDto)
  rideEvent?: RideEventMinimalDto | null;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
