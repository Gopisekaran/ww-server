import { Module } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtSharedModule } from '../shared/jwt-shared.module';
import { BikerProfile } from '../biker-profile/entities/biker-profile.entity';
import { Badge } from './entities/badge.entity';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { RoleGuard } from '../shared/role.guard';
import { UserBadge } from './entities/user-badges.entity';
import { BadgeLevel } from './entities/badge-level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BikerProfile, Badge, UserBadge, BadgeLevel]),
    JwtSharedModule,
  ],
  controllers: [BadgeController],
  providers: [BadgeService, SupabaseAuthGuard, RoleGuard],
  exports: [BadgeService],
})
export class BadgeModule {}
