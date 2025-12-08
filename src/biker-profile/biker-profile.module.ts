import { Module } from '@nestjs/common';
import { BikerProfileService } from './biker-profile.service';
import { BikerProfileController } from './biker-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikerProfile } from './entities/biker-profile.entity';
import { SupabaseAuthGuard } from '../auth/supabase-auth/supabase-auth.guard';
import { JwtSharedModule } from '../shared/jwt-shared.module';
import { RoleGuard } from '../shared/role.guard';
import { Badge } from '../badge/entities/badge.entity';
import { UserBadge } from '../badge/entities/user-badges.entity';
import { Region } from './entities/region.entity';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BikerProfile, Badge, UserBadge, Region]),
    JwtSharedModule,
  ],
  controllers: [BikerProfileController, RegionController],
  providers: [BikerProfileService, RegionService, SupabaseAuthGuard, RoleGuard],
  exports: [BikerProfileService, RegionService],
})
export class BikerProfileModule {}
