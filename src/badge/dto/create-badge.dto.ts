import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BadgeCategory } from '../entities/badge.entity';

export class CreateBadgeLevelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @Min(1)
  count!: number;

  @IsString()
  @IsNotEmpty()
  imageUrl!: string;
}

export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  iconUrl?: string;

  @IsEnum(BadgeCategory)
  category: BadgeCategory;

  @IsBoolean()
  @IsOptional()
  isRepeatable?: boolean;

  @IsUUID()
  @IsOptional()
  rideEventId?: string;

  @IsUUID()
  @IsOptional()
  rideTypeId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBadgeLevelDto)
  levels?: CreateBadgeLevelDto[];
}
