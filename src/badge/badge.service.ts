import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Badge } from './entities/badge.entity';
import { BadgeLevel } from './entities/badge-level.entity';
import { UserBadge } from './entities/user-badges.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BadgeListDto } from './dto/badge-list-dto';
import { ProfileBadgeDto } from './dto/profile-badge-response.dto';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
    @InjectRepository(BadgeLevel)
    private readonly badgeLevelRepository: Repository<BadgeLevel>,
    @InjectRepository(UserBadge)
    private readonly userBadgeRepository: Repository<UserBadge>,
  ) {}

  async create(createBadgeDto: CreateBadgeDto) {
    try {
      const { rideEventId, rideTypeId, isRepeatable, levels } = createBadgeDto;

      if (rideEventId && rideTypeId) {
        throw new BadRequestException(
          'A badge can be linked to either a ride event or a ride type, not both.',
        );
      }

      if (isRepeatable && !rideTypeId) {
        throw new BadRequestException(
          'Only ride-type badges can be repeatable. Provide rideTypeId when isRepeatable is true.',
        );
      }

      if (rideEventId) {
        const existingForEvent = await this.badgeRepository.findOne({
          where: { rideEventId },
        });
        if (existingForEvent) {
          throw new BadRequestException(
            'This ride event already has a badge assigned.',
          );
        }
      }

      if (rideTypeId) {
        const existingForType = await this.badgeRepository.findOne({
          where: { rideTypeId },
        });
        if (existingForType) {
          throw new BadRequestException(
            'This ride type already has a badge assigned.',
          );
        }
      }

      const badge = this.badgeRepository.create({
        ...createBadgeDto,
        isRepeatable: isRepeatable ?? false,
        levels: levels?.map((level) => ({
          name: level.name,
          description: level.description,
          count: level.count,
          imageUrl: level.imageUrl,
        })),
      });

      const saved = await this.badgeRepository.save(badge);

      const withRelations = await this.badgeRepository.findOne({
        where: { id: saved.id },
        relations: ['rideType', 'rideEvent', 'levels'],
      });

      return plainToInstance(BadgeListDto, withRelations, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Failed to create badge');
    }
  }

  async findAll() {
    try {
      const badges = await this.badgeRepository.find({
        relations: ['rideType', 'rideEvent', 'levels'],
      });

      return plainToInstance(BadgeListDto, badges, {
        excludeExtraneousValues: true, // removes all non-@Expose fields
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to get badges: ');
    }
  }

  async findOne(id: string) {
    const badge = await this.badgeRepository.findOne({
      where: { id },
      relations: ['rideType', 'rideEvent', 'levels'],
    });

    if (!badge) {
      throw new NotFoundException('Badge not found');
    }

    return plainToInstance(BadgeListDto, badge, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateBadgeDto: UpdateBadgeDto) {
    try {
      if (
        Object.prototype.hasOwnProperty.call(updateBadgeDto, 'rideEventId') ||
        Object.prototype.hasOwnProperty.call(updateBadgeDto, 'rideTypeId')
      ) {
        throw new BadRequestException(
          'rideEventId and rideTypeId cannot be updated once set',
        );
      }

      const badge = await this.badgeRepository.findOne({
        where: { id },
        relations: ['rideType', 'rideEvent', 'levels'],
      });

      if (!badge) {
        throw new NotFoundException('Badge not found');
      }

      if (
        updateBadgeDto.isRepeatable === true &&
        !badge.rideTypeId &&
        !badge.rideType
      ) {
        throw new BadRequestException(
          'Only ride-type badges can be repeatable.',
        );
      }

      Object.assign(badge, {
        title: updateBadgeDto.title ?? badge.title,
        description:
          updateBadgeDto.description !== undefined
            ? updateBadgeDto.description
            : badge.description,
        iconUrl:
          updateBadgeDto.iconUrl !== undefined
            ? updateBadgeDto.iconUrl
            : badge.iconUrl,
        category: updateBadgeDto.category ?? badge.category,
        isRepeatable:
          updateBadgeDto.isRepeatable !== undefined
            ? updateBadgeDto.isRepeatable
            : badge.isRepeatable,
      });

      if (updateBadgeDto.levels) {
        await this.badgeLevelRepository.delete({ badgeId: id });
        badge.levels = updateBadgeDto.levels.map((level) =>
          this.badgeLevelRepository.create({
            name: level.name,
            description: level.description,
            count: level.count,
            imageUrl: level.imageUrl,
            badgeId: id,
          }),
        );
      }

      await this.badgeRepository.save(badge);

      const updated = await this.badgeRepository.findOne({
        where: { id },
        relations: ['rideType', 'rideEvent', 'levels'],
      });

      return plainToInstance(BadgeListDto, updated, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.log(error);
      throw new InternalServerErrorException('Failed to update badge');
    }
  }

  remove(id: string) {
    return `This action removes a #${id} badge`;
  }

  async findAllForProfile(bikerId: string): Promise<ProfileBadgeDto[]> {
    try {
      const badges = await this.badgeRepository.find({
        relations: ['levels'],
      });

      // Get user's badges with counts
      const userBadges = await this.userBadgeRepository.find({
        where: { bikerId },
      });

      const userBadgeMap = new Map<string, number>();
      userBadges.forEach((ub) => {
        userBadgeMap.set(ub.badgeId, ub.count);
      });

      return badges.map((badge) => {
        const userCount = userBadgeMap.get(badge.id) ?? 0;
        const locked = userCount === 0;

        return {
          id: badge.id,
          title: badge.title,
          description: badge.description,
          iconUrl: locked ? '' : badge.iconUrl,
          category: badge.category,
          rideEventId: badge.rideEventId,
          rideTypeId: badge.rideTypeId,
          isRepeatable: badge.isRepeatable,
          locked,
          userCount,
          levels: (badge.levels || []).map((level) => {
            const levelLocked = userCount < level.count;
            return {
              id: level.id,
              name: level.name,
              description: level.description,
              count: level.count,
              imageUrl: levelLocked ? '' : level.imageUrl,
              locked: levelLocked,
            };
          }),
        };
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to get badges for profile',
      );
    }
  }
}
