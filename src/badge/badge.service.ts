import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Badge } from './entities/badge.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { BadgeListDto } from './dto/badge-list-dto';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
  ) {}

  create(createBadgeDto: CreateBadgeDto) {
    return 'This action adds a new badge';
  }

  async findAll() {
    try {
      const badges = await this.badgeRepository.find({
        relations: ['rideType', 'rideEvent'],
      });

      return plainToInstance(BadgeListDto, badges, {
        excludeExtraneousValues: true, // removes all non-@Expose fields
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to get badges: ');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} badge`;
  }

  update(id: number, updateBadgeDto: UpdateBadgeDto) {
    return `This action updates a #${id} badge`;
  }

  remove(id: number) {
    return `This action removes a #${id} badge`;
  }
}
