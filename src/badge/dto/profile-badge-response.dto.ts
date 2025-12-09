import { Expose, Type } from 'class-transformer';

export class ProfileBadgeLevelDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  count: number;

  @Expose()
  imageUrl: string;

  @Expose()
  locked: boolean;
}

export class ProfileBadgeDto {
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
  locked: boolean;

  @Expose()
  userCount: number;

  @Expose()
  @Type(() => ProfileBadgeLevelDto)
  levels: ProfileBadgeLevelDto[];
}
