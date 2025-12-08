import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateBikerProfileDto } from '../biker-profile/dto/create-biker-profile.dto';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  create(@Body() createBikerProfileDto: CreateBikerProfileDto) {
    return this.authService.supabaseSignup(createBikerProfileDto);
  }

  @Post('/signin')
  async login(
    @Body() request: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.login(request);
    response.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: false,
    });
    return data;
  }

  @Post('/refresh-token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies.refreshToken;

    const data = await this.authService.refreshToken({ refreshToken });
    response.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    return data;
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body() request: { email: string; redirectTo?: string },
  ) {
    return this.authService.forgotPassword(request.email, request.redirectTo);
  }
}
