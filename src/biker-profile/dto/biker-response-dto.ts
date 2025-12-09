import { Expose, Type } from 'class-transformer';
import { RoleResponseDto } from '../../role-management/dto/role-response.dto';

export class RegionDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class BadgeDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  iconUrl: string;

  @Expose()
  description: string;
}

export class UserBadgeDto {
  @Expose()
  id: string;

  @Expose()
  count: number;

  @Expose()
  reason: string;

  @Expose()
  earnedAt: Date;

  @Expose()
  @Type(() => BadgeDto)
  badge: BadgeDto;
}

export class EventLiteDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  totalKilometers: number;
}

export class ParticipationDto {
  @Expose()
  id: string;

  @Expose()
  hasParticipated: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => EventLiteDto)
  event: EventLiteDto;
}

export class BikerResponseDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  whatsappNumber: string;

  @Expose()
  mobileNumber: string;

  @Expose()
  acceptTerms: boolean;

  @Expose()
  native: string;

  @Expose()
  residing: string;

  @Expose()
  dob: Date;

  @Expose()
  bloodGroup: string;

  @Expose()
  drivingLicenseNumber: string;

  @Expose()
  bikeNameAndModel: string;

  @Expose()
  gears: string[];

  @Expose()
  emergencyContactPersonName: string;

  @Expose()
  emergencyContactPersonNumber: string;

  @Expose()
  isMedicalAlignment: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  medicalAlignmentDetails: string;

  @Expose()
  profileImage: string;

  @Expose()
  referredById: string;

  @Expose()
  roleId: string;

  @Expose()
  joiningDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => RoleResponseDto)
  role: RoleResponseDto;

  @Expose()
  regionId: string;

  @Expose()
  @Type(() => RegionDto)
  region: RegionDto;

  @Expose()
  @Type(() => ParticipationDto)
  participations: ParticipationDto[];

  @Expose()
  @Type(() => UserBadgeDto)
  userBadges: UserBadgeDto[];
}
