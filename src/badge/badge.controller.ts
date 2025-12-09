import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { RoleGuard } from 'src/shared/role.guard';
import { SupabaseUid } from '../shared/get-supabase-uuid-req';

@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @Post()
  create(@Body() createBadgeDto: CreateBadgeDto) {
    return this.badgeService.create(createBadgeDto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get()
  findAll() {
    return this.badgeService.findAll();
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('profile/my-badges')
  findAllForProfile(@SupabaseUid() bikerId: string) {
    return this.badgeService.findAllForProfile(bikerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.badgeService.findOne(id);
  }

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBadgeDto: UpdateBadgeDto) {
    return this.badgeService.update(id, updateBadgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.badgeService.remove(id);
  }
}
