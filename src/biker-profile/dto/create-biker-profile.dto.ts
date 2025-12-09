import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBikerProfileDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  whatsappNumber: string;

  @IsString()
  mobileNumber: string;

  @IsString()
  password: string;

  @IsBoolean()
  acceptTerms: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  native: string;

  @IsString()
  residing: string;

  @IsDateString()
  dob: Date;

  @IsDateString()
  joiningDate: Date;

  @IsString()
  bloodGroup: string;

  @IsString()
  drivingLicenseNumber: string;

  @IsString()
  bikeNameAndModel: string;

  @IsArray()
  gears: string[];

  @IsOptional()
  @IsUUID()
  regionId?: string;
}

export class CreateBikeProfileSupabase extends CreateBikerProfileDto {
  @IsUUID()
  id: string;
}
