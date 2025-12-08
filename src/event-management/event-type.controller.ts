import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EventTypeService } from './event-type.service';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { RoleGuard } from '../shared/role.guard';

@UsePipes(new ValidationPipe({ transform: true }))
@Controller('event-types')
export class EventTypeController {
  constructor(private readonly eventTypeService: EventTypeService) {}

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @Post()
  create(@Body() dto: CreateEventTypeDto) {
    return this.eventTypeService.create(dto);
  }

  @Get()
  findAll() {
    return this.eventTypeService.findAll();
  }

  @Get('active-events')
  getActiveEvents() {
    return this.eventTypeService.getActiveEvents();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.eventTypeService.findOne(id);
  }

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEventTypeDto,
  ) {
    return this.eventTypeService.update(id, dto);
  }

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.eventTypeService.remove(id);
  }
}
