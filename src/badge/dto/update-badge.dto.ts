import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBadgeDto } from './create-badge.dto';

export class UpdateBadgeDto extends PartialType(
  OmitType(CreateBadgeDto, ['rideEventId', 'rideTypeId'] as const),
) {}
