import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateBikerProfileDto } from '../biker-profile/dto/create-biker-profile.dto';
import { BikerProfileService } from '../biker-profile/biker-profile.service';

@Injectable()
export class AuthService {
  private supabaseClient: SupabaseClient;

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => BikerProfileService))
    private bikerProfileService: BikerProfileService,
  ) {
    this.supabaseClient = createClient(
      `${this.configService.get<string>('NX_PUBLIC_SUPABASE_URL')}`,
      `${this.configService.get<string>('NX_PUBLIC_SERVICE_ROLE_KEY')}`,
    );
  }

  async login(request: { email: string; password: string }) {
    const { email, password } = request;
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(`Sign-in failed: ${error?.message}`);
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: data.user,
    };
  }

  async refreshToken(request: { refreshToken: string }) {
    const { refreshToken } = request;
    const { data, error } = await this.supabaseClient.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new UnauthorizedException(`Refresh failed: ${error?.message}`);
    }

    if (!data || !data.session) {
      throw new UnauthorizedException(`Refresh failed: Invalid refresh token`);
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: data.user,
    };
  }

  async supabaseSignup(createBikerProfileDto: CreateBikerProfileDto) {
    const { data, error } = await this.supabaseClient.auth.admin.createUser({
      email: createBikerProfileDto.email,
      password: createBikerProfileDto.password,
      // user_metadata: createBikerProfileDto, // Optional: add custom user metadata
      email_confirm: true, // Optional: auto-confirm email
    });

    if (!data) {
      throw new Error(`Error creating user: ${error?.message}`);
    }
    if (error) {
      throw new ConflictException(`Error creating user: ${error?.message}`);
    }

    return await this.bikerProfileService.create({
      ...createBikerProfileDto,
      id: data.user.id,
    });
  }

  async forgotPassword(email: string, redirectTo?: string) {
    // Check if user exists in biker_profile table
    const profile = await this.bikerProfileService.findByEmail(email);

    if (!profile) {
      throw new BadRequestException('No account found with this email address');
    }

    console.log(redirectTo);

    const { data, error } =
      await this.supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

    if (error) {
      throw new BadRequestException(
        `Failed to send reset email: ${error.message}`,
      );
    }

    return { message: 'Password reset email sent successfully', data };
  }
}
