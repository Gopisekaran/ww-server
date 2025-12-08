import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BikerProfileModule } from '../biker-profile/biker-profile.module';

@Module({
  imports: [BikerProfileModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
