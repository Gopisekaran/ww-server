import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBikeProfileSupabase } from './dto/create-biker-profile.dto';
import { UpdateBikerProfileDto } from './dto/update-biker-profile.dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { BikerProfile } from './entities/biker-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDTO } from '../shared/pagination.dto';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';
import { plainToInstance } from 'class-transformer';
import { BikerResponseDTO } from './dto/biker-response-dto';

@Injectable()
export class BikerProfileService {
  private supabaseClient: SupabaseClient;

  constructor(
    private configService: ConfigService,

    @InjectRepository(BikerProfile)
    private readonly bikerRepository: Repository<BikerProfile>,
  ) {
    this.supabaseClient = createClient(
      `${this.configService.get<string>('NX_PUBLIC_SUPABASE_URL')}`,
      `${this.configService.get<string>('NX_PUBLIC_SERVICE_ROLE_KEY')}`,
    );
  }

  async create(createBikerProfileDto: CreateBikeProfileSupabase) {
    try {
      const bikerProfile = this.bikerRepository.create({
        ...createBikerProfileDto,
      });
      // Now insert into your own DB
      return await this.bikerRepository.save(bikerProfile);
    } catch (profileError) {
      // Rollback: delete the created user from Supabase Auth
      await this.supabaseClient.auth.admin.deleteUser(createBikerProfileDto.id);
      throw new ConflictException(
        `User profile creation failed: ${(profileError as any).message}`,
      );
    }
  }

  async login(request: { email: string; password: string }) {
    const { email, password } = request;
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(`Sign-in failed: ${error.message}`);
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: data.user,
    };
  }

  async findAll(paginationDTO: PaginationDTO) {
    const take = paginationDTO.limit ?? DEFAULT_PAGE_SIZE;
    const currentPage = paginationDTO.page ?? 1;
    const skip = (currentPage - 1) * take;
    const [bikers, total] = await this.bikerRepository.findAndCount({
      take: take,
      skip: skip,
    });

    const updatedBikers = plainToInstance(BikerResponseDTO, bikers, {
      excludeExtraneousValues: true, // removes all non-@Expose fields
    });
    return {
      data: updatedBikers,
      total,
      limit: take,
      skip: skip,
      page: paginationDTO.page ?? 1,
      nextPage: total > take * currentPage ? currentPage + 1 : null,
    };
  }

  async findOne(id: string) {
    const biker = await this.bikerRepository.findOne({
      where: { id },
      relations: [
        'participations',
        'participations.event',
        'participations.event.eventType',
        'userBadges',
        'userBadges.badge',
      ],
    });
    if (!biker) {
      throw new NotFoundException('Biker not found');
    }
    const dto = plainToInstance(BikerResponseDTO, biker, {
      excludeExtraneousValues: true,
    });
    return dto;
  }

  async findByEmail(email: string) {
    return this.bikerRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async update(
    supabaseUid: string,
    updateBikerProfileDto: UpdateBikerProfileDto,
  ) {
    const user = await this.bikerRepository.findOne({
      where: { id: supabaseUid },
    });

    if (!user) throw new NotFoundException('Profile not found');

    Object.assign(user, updateBikerProfileDto);

    return await this.bikerRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} bikerProfile`;
  }
}
