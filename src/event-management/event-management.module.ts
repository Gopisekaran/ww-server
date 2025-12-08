import { Module } from '@nestjs/common';
import { EventManagementService } from './event-management.service';
import { EventManagementController } from './event-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventParticipant } from './entities/event-participant.entity';
import { EventType } from './entities/event-type.entity';
import { RideEvent } from './entities/event.entity';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { JwtSharedModule } from '../shared/jwt-shared.module';
import { RoleGuard } from '../shared/role.guard';
import { BikerProfile } from '../biker-profile/entities/biker-profile.entity';
import { RideEventItinerary } from './entities/event-itenery.entity';
import { EventTypeController } from './event-type.controller';
import { EventTypeService } from './event-type.service';
import { Badge } from '../badge/entities/badge.entity';
import { UserBadge } from '../badge/entities/user-badges.entity';
import { BadgeLevel } from '../badge/entities/badge-level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventType,
      EventParticipant,
      RideEvent,
      RideEventItinerary,
      BikerProfile,
      Badge,
      UserBadge,
      BadgeLevel,
    ]),
    JwtSharedModule,
  ],
  controllers: [EventManagementController, EventTypeController],
  providers: [
    EventManagementService,
    EventTypeService,
    SupabaseAuthGuard,
    RoleGuard,
  ],
})
export class EventManagementModule {}
