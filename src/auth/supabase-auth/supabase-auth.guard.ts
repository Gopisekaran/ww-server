import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthorizedException('No Token Provided');
    }
    const token = authHeader.split(' ')[1];

    try {
      const decode = this.jwtService.verify(token);
      request['user'] = decode;
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid Token ${(error as any).message}`,
      );
    }
  }
}
