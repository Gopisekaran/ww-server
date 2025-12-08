import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BikerProfileModule } from './biker-profile/biker-profile.module';
import { EventManagementModule } from './event-management/event-management.module';
import { RoleManagementModule } from './role-management/role-management.module';
import { AuthModule } from './auth/auth.module';

import { BadgeModule } from './badge/badge.module';
import { JwtSharedModule } from './shared/jwt-shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('NX_PUBLIC_SUPABASE_JWT_SECRET'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('NX_PUBLIC_DATABASE_URL'),
        entities: [],
        ssl: {
          rejectUnauthorized: false, // Required if using self-signed or cloud providers
        },
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        // It is like INIT true
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    BikerProfileModule,
    EventManagementModule,
    RoleManagementModule,
    AuthModule,
    JwtSharedModule,
    BadgeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
