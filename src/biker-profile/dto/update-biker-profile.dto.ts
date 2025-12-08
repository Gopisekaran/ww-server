import { PartialType } from '@nestjs/mapped-types';
import { CreateBikerProfileDto } from './create-biker-profile.dto';

export class UpdateBikerProfileDto extends PartialType(CreateBikerProfileDto) {}
