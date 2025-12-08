// jwt-shared.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('NX_PUBLIC_SUPABASE_JWT_SECRET'),
      }),
    }),
  ],
  exports: [JwtModule], // make JwtService available to other modules
})
export class JwtSharedModule {}
