import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BikerProfileService } from './biker-profile.service';
import { UpdateBikerProfileDto } from './dto/update-biker-profile.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { PaginationDTO } from '../shared/pagination.dto';
import { RoleGuard } from '../shared/role.guard';

@Controller('biker-profile')
@UsePipes(new ValidationPipe({ transform: true }))
export class BikerProfileController {
  constructor(private readonly bikerProfileService: BikerProfileService) {}

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @Get()
  async findAll(@Query() paginationDTO: PaginationDTO) {
    const bikers = await this.bikerProfileService.findAll(paginationDTO);
    return {
      message: 'Bikers List Fetched Successfully ',
      body: bikers,
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const biker = await this.bikerProfileService.findOne(id);
    return {
      message: 'Biker fetched successfully',
      body: biker,
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Put()
  update(
    @Body() updateBikerProfileDto: UpdateBikerProfileDto,
    @Req() req: any,
  ) {
    const supabaseUid = req?.['user']?.sub;
    return this.bikerProfileService.update(supabaseUid, updateBikerProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bikerProfileService.remove(+id);
  }
}
