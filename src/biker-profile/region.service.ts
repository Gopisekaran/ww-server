import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { CreateRegionDto } from './dto/create-region-dto';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    const region = this.regionRepository.create(createRegionDto);
    return this.regionRepository.save(region);
  }

  async findAll(): Promise<Region[]> {
    return this.regionRepository.find();
  }

  async findOne(id: string): Promise<Region> {
    const region = await this.regionRepository.findOne({ where: { id } });

    if (!region) {
      throw new NotFoundException('Region not found');
    }

    return region;
  }

  async update(id: string, updateRegionDto: CreateRegionDto): Promise<Region> {
    const region = await this.regionRepository.findOne({ where: { id } });

    if (!region) {
      throw new NotFoundException('Region not found');
    }

    Object.assign(region, updateRegionDto);
    return this.regionRepository.save(region);
  }

  async remove(id: string): Promise<void> {
    const result = await this.regionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Region not found');
    }
  }
}
