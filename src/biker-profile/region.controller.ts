import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region-dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { RoleGuard } from '../shared/role.guard';

@Controller('regions')
@UsePipes(new ValidationPipe({ transform: true }))
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @Post()
  async create(@Body() createRegionDto: CreateRegionDto) {
    const region = await this.regionService.create(createRegionDto);
    return {
      message: 'Region created successfully',
      body: region,
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Get()
  async findAll() {
    const regions = await this.regionService.findAll();
    return {
      message: 'Regions fetched successfully',
      body: regions,
    };
  }

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const region = await this.regionService.findOne(id);
    return {
      message: 'Region fetched successfully',
      body: region,
    };
  }

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRegionDto: CreateRegionDto,
  ) {
    const region = await this.regionService.update(id, updateRegionDto);
    return {
      message: 'Region updated successfully',
      body: region,
    };
  }

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.regionService.remove(id);
    return {
      message: 'Region deleted successfully',
    };
  }
}
