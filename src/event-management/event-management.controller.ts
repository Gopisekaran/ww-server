import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { EventManagementService } from './event-management.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateParticipantsStatusDto } from './dto/update-participants-status.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { RoleGuard } from '../shared/role.guard';
import { SupabaseUid } from '../shared/get-supabase-uuid-req';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  PublicRideFilterDto,
  PublicRideListResponseDto,
} from './dto/public-ride-response.dto';

@ApiTags('Events')
@Controller('event-management')
export class EventManagementController {
  constructor(
    private readonly eventManagementService: EventManagementService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Create a new ride event' })
  @ApiOkResponse({ description: 'Event created successfully' })
  @Post()
  async create(
    @Body() createEventManagementDto: CreateEventDto,
    @SupabaseUid() supabaseUid: string,
  ) {
    const createdEvent = await this.eventManagementService.create(
      supabaseUid,
      createEventManagementDto,
    );
    return {
      message: 'Event Created Successfully',
      body: createdEvent,
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all events (auth required)' })
  @ApiOkResponse({ description: 'List of events with counts and badges' })
  @Get()
  findAll() {
    return this.eventManagementService.findAll();
  }

  @Get('public-rides')
  @ApiOperation({
    summary: 'List public rides (no auth)',
    description:
      'Returns upcoming rides filtered by optional start/end date excluding cancelled or aborted events.',
  })
  @ApiOkResponse({
    type: PublicRideListResponseDto,
    isArray: true,
    description: 'Filtered public rides without price info',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'ISO start date (inclusive) to filter rides',
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'ISO end date (inclusive) to filter rides',
    example: '2025-01-31',
  })
  findPublicRides(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    filter: PublicRideFilterDto,
  ) {
    return this.eventManagementService.findPublicRides(filter);
  }

  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @Get('ongoing-rides')
  @ApiOperation({
    summary: 'List ongoing rides (no auth)',
    description:
      'Returns rides that are currently ongoing based on the current date (startDate <= today <= endDate), excluding cancelled, aborted, or completed events.',
  })
  @ApiOkResponse({
    type: PublicRideListResponseDto,
    isArray: true,
    description: 'List of ongoing rides',
  })
  findOngoingRides() {
    return this.eventManagementService.findOngoingRides();
  }

  // New: Rider joins event via POST
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join an event' })
  @ApiParam({
    name: 'id',
    description: 'Event ID',
    example: 'b4a2c9f5-2e31-4c71-9f2b-3a6b8b1d2e45',
  })
  @Post(':id/join')
  joinEventPost(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @SupabaseUid() supabaseUid: string,
  ) {
    return this.eventManagementService.joinEvent(supabaseUid, eventId);
  }

  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave an event (only if not completed)' })
  @ApiParam({
    name: 'id',
    description: 'Event ID',
    example: 'b4a2c9f5-2e31-4c71-9f2b-3a6b8b1d2e45',
  })
  @Post(':id/leave')
  leaveEventPost(
    @Param('id', new ParseUUIDPipe()) eventId: string,
    @SupabaseUid() supabaseUid: string,
  ) {
    return this.eventManagementService.leaveEvent(supabaseUid, eventId);
  }

  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get event details (with itineraries, badges, participants)',
  })
  @ApiParam({
    name: 'id',
    description: 'Event ID',
    example: 'b4a2c9f5-2e31-4c71-9f2b-3a6b8b1d2e45',
  })
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @SupabaseUid() requesterId: string,
  ) {
    return this.eventManagementService.findOne(id, requesterId);
  }

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an event (admin/moderator)' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiOkResponse({ description: 'Updated event' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventManagementService.update(id, updateEventDto);
  }

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an event (admin/moderator)' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.eventManagementService.remove(id);
  }

  // Admin actions: cancel, abort, complete
  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an event (removes participants)' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @Post(':id/cancel')
  cancel(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.eventManagementService.cancel(id);
  }

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Abort an event (removes participants)' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @Post(':id/abort')
  abort(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.eventManagementService.abort(id);
  }

  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete an event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @Post(':id/complete')
  complete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.eventManagementService.complete(id);
  }

  // Admin: update single participant participation status and award badges
  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a participant's participation status" })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({
    description: 'Participant status change',
    type: UpdateParticipantsStatusDto,
    examples: {
      markParticipated: {
        summary: 'Mark as participated',
        value: {
          participantId: '81c1a3a8-6d6c-4e9d-9c13-41a2f88db9f2',
          hasParticipated: true,
        },
      },
    },
  })
  @Post(':id/participants/status')
  updateParticipantStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateParticipantsStatusDto,
  ) {
    return this.eventManagementService.updateParticipantsStatus(id, body);
  }

  // Admin: kick participant and reverse badges
  @UseGuards(SupabaseAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Kick a participant from an event and reverse badges',
  })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        participantId: {
          type: 'string',
          format: 'uuid',
          example: '81c1a3a8-6d6c-4e9d-9c13-41a2f88db9f2',
        },
      },
      required: ['participantId'],
    },
  })
  @Post(':id/participants/kick')
  kickParticipant(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('participantId', new ParseUUIDPipe()) participantId: string,
  ) {
    return this.eventManagementService.kickParticipant(id, participantId);
  }
}
