import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventType } from './entities/event-type.entity';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { plainToInstance } from 'class-transformer';
import {
  EventTypeAndEventsDto,
  EventTypeResponseDto,
} from './dto/event-type-response.dto';

@Injectable()
export class EventTypeService {
  constructor(
    @InjectRepository(EventType)
    private readonly eventTypeRepo: Repository<EventType>,
  ) {}

  async create(dto: CreateEventTypeDto) {
    try {
      const entity = this.eventTypeRepo.create({
        name: dto.name,
        isActive: dto.isActive ?? true,
      });
      return await this.eventTypeRepo.save(entity);
    } catch (error) {
      console.error('Error creating event type:', error);
      throw new InternalServerErrorException('Failed to create event type: ');
    }
  }

  async findAll() {
    const eventTypes = this.eventTypeRepo.find({
      relations: ['badge', 'events'],
      order: { name: 'ASC' },
    });

    return plainToInstance(EventTypeResponseDto, eventTypes, {
      excludeExtraneousValues: true, // removes all non-@Expose fields
    });
  }

  async findOne(id: string) {
    const et = await this.eventTypeRepo.findOne({ where: { id } });
    if (!et) throw new NotFoundException('Event type not found');
    return et;
  }

  async update(id: string, dto: UpdateEventTypeDto) {
    const et = await this.findOne(id);
    Object.assign(et, dto);
    return this.eventTypeRepo.save(et);
  }

  async remove(id: string) {
    const et = await this.findOne(id);
    await this.eventTypeRepo.remove(et);
    return { id };
  }

  async getActiveEvents() {
    const eventTypes = await this.eventTypeRepo
      .createQueryBuilder('eventType')
      .leftJoinAndSelect(
        'eventType.events',
        'event',
        'event.isCancelled = false AND event.isAborted = false AND event.isCompleted = false',
      )
      .leftJoinAndSelect('eventType.badge', 'badge')
      .leftJoinAndSelect('event.badge', 'badgeEvent')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('event.createdUser', 'createdUser')
      .where('event.id IS NOT NULL') // ensure at least one active event
      .orderBy('eventType.name', 'ASC')
      .getMany();

    return plainToInstance(EventTypeAndEventsDto, eventTypes, {
      excludeExtraneousValues: true, // removes all non-@Expose fields
    });
  }
}
