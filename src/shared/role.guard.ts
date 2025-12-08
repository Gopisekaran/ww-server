// role.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BikerProfile } from '../biker-profile/entities/biker-profile.entity';
import { UserRole } from '../role-management/entities/role-management.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(BikerProfile)
    private readonly userRepo: Repository<BikerProfile>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userFromToken = request.user; // Comes from AuthGuard
    console.log(userFromToken?.sub);

    if (!userFromToken?.sub) {
      throw new ForbiddenException('No user ID in token');
    }

    const user = await this.userRepo.findOne({
      where: { id: userFromToken?.sub },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.role.roleType === UserRole.member) {
      throw new ForbiddenException('Admin role required');
    }

    return true;
  }
}
