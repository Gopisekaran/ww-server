import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RideEvent } from './entities/event.entity';
import { RideEventItinerary } from './entities/event-itenery.entity';
import { plainToInstance } from 'class-transformer';
import { EventListResponseDto } from './dto/event-list-response.dto';
import { EventParticipant } from './entities/event-participant.entity';
import { EventDetailsDTO } from './dto/event-detail-response.dto';
import { BikerProfile } from '../biker-profile/entities/biker-profile.entity';
import { UserRole } from '../role-management/entities/role-management.entity';
import { UpdateParticipantsStatusDto } from './dto/update-participants-status.dto';
import { UserBadge } from '../badge/entities/user-badges.entity';
import {
  PublicRideFilterDto,
  PublicRideListResponseDto,
} from './dto/public-ride-response.dto';

@Injectable()
export class EventManagementService {
  constructor(
    @InjectRepository(RideEvent)
    private readonly eventRepository: Repository<RideEvent>,

    @InjectRepository(EventParticipant)
    private readonly eventParticipant: Repository<EventParticipant>,

    @InjectRepository(RideEventItinerary)
    private readonly itineraryRepository: Repository<RideEventItinerary>,

    @InjectRepository(BikerProfile)
    private readonly bikerRepo: Repository<BikerProfile>,

    @InjectRepository(UserBadge)
    private readonly userBadgeRepo: Repository<UserBadge>,
  ) {}

  async create(supabaseUid: string, createEventManagementDto: CreateEventDto) {
    try {
      const event = this.eventRepository.create({
        ...createEventManagementDto,
        creatorId: supabaseUid,
      });
      const createdEvent = await this.eventRepository.save(event);

      return createdEvent;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Issue while Creating Event');
    }
  }

  async findAll() {
    const events = await this.eventRepository.find({
      relations: [
        'participants',
        'participants.biker',
        'badge',
        'eventType',
        'eventType.badge',
      ],
    });

    return plainToInstance(EventListResponseDto, events, {
      excludeExtraneousValues: true, // removes all non-@Expose fields
    });
  }

  async findPublicRides(filter: PublicRideFilterDto) {
    const { startDate, endDate } = filter;
    const where: any = {
      isCancelled: false,
      isAborted: false,
    };

    // Filter rides that overlap with the given date range
    // A ride overlaps if: ride.startDate <= filter.endDate AND ride.endDate >= filter.startDate
    if (startDate && endDate) {
      where.startDate = LessThanOrEqual(new Date(endDate));
      where.endDate = MoreThanOrEqual(new Date(startDate));
    } else if (startDate) {
      // Ride ends on or after the filter start date
      where.endDate = MoreThanOrEqual(new Date(startDate));
    } else if (endDate) {
      // Ride starts on or before the filter end date
      where.startDate = LessThanOrEqual(new Date(endDate));
    }

    const events = await this.eventRepository.find({
      where,
      relations: [
        'participants',
        'participants.biker',
        'badge',
        'eventType',
        'eventType.badge',
        'createdUser',
      ],
      order: { startDate: 'ASC', time: 'ASC' },
    });

    const filtered = events.filter(
      (event) => !event.isCancelled && !event.isAborted,
    );

    return plainToInstance(PublicRideListResponseDto, filtered, {
      excludeExtraneousValues: true,
    });
  }

  async findOngoingRides() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await this.eventRepository.find({
      where: {
        isCancelled: false,
        isAborted: false,
        isCompleted: false,
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
      relations: [
        'participants',
        'participants.biker',
        'badge',
        'eventType',
        'eventType.badge',
        'createdUser',
      ],
      order: { startDate: 'ASC', time: 'ASC' },
    });

    return plainToInstance(PublicRideListResponseDto, events, {
      excludeExtraneousValues: true,
    });
  }

  async joinEvent(supabaseUid: string, eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const checkForJoinedAlready = await this.eventParticipant.findOne({
      where: { eventId: eventId, bikerId: supabaseUid },
    });

    if (checkForJoinedAlready) {
      throw new ConflictException('You have already joined this event');
    }

    const eventParticipated = this.eventParticipant.create({
      eventId: eventId,
      bikerId: supabaseUid,
    });

    const data = this.eventParticipant.save(eventParticipated);
    return data;
  }

  async leaveEvent(supabaseUid: string, eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.isCompleted) {
      throw new ConflictException('Cannot leave a completed event');
    }

    const participation = await this.eventParticipant.findOne({
      where: { eventId, bikerId: supabaseUid },
    });

    if (!participation) {
      throw new NotFoundException('You have not joined this event');
    }

    await this.eventParticipant.delete({ id: participation.id });
    return { left: true };
  }

  async findOne(id: string, requesterId?: string) {
    const event = await this.eventRepository.findOne({
      where: { id: id },
      relations: [
        'participants',
        'participants.biker',
        'itineraries',
        'badge',
        'eventType',
        'eventType.badge',
      ],
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    let includePayment = false;
    if (requesterId) {
      const requester = await this.bikerRepo.findOne({
        where: { id: requesterId },
      });
      if (
        requester &&
        requester.role?.roleType &&
        requester.role.roleType !== UserRole.member
      ) {
        includePayment = true;
      }
    }

    const shaped = {
      ...event,
      participants: event.participants?.map((p) => ({
        ...p,
        paidAmount: includePayment ? p.paidAmount : undefined,
        hasParticipated: includePayment ? p.hasParticipated : undefined,
      })),
    };

    return plainToInstance(EventDetailsDTO, shaped, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const { itineraries, ...rest } = updateEventDto;
    Object.assign(event, rest);
    await this.eventRepository.save(event);

    // Replace itineraries if provided
    if (Array.isArray(itineraries)) {
      await this.itineraryRepository.delete({ eventId: id });
      if (itineraries.length > 0) {
        const partials = itineraries.map((i) => ({
          eventId: id,
          date: new Date(i.date),
          title: i.title,
          description: i.description,
          mapLinks: i.mapLinks,
          kmToCover: i.kmToCover != null ? Number(i.kmToCover) : undefined,
          dayOrder: i.dayOrder,
        }));
        await this.itineraryRepository.save(partials);
      }
    }

    // Return updated details including itineraries
    const updated = await this.eventRepository.findOne({
      where: { id },
      relations: ['participants', 'participants.biker', 'itineraries'],
    });
    return updated;
  }

  async remove(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    await this.eventRepository.remove(event);
    return { id };
  }

  async cancel(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    // Remove all participants when cancelling the event
    await this.eventParticipant.delete({ eventId: id });
    event.isCancelled = true;
    event.isAborted = false;
    event.isCompleted = false;
    await this.eventRepository.save(event);
    return this.findOne(id);
  }

  async abort(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    // Remove all participants for this event
    await this.eventParticipant.delete({ eventId: id });
    event.isAborted = true;
    event.isCancelled = false;
    event.isCompleted = false;
    await this.eventRepository.save(event);
    return this.findOne(id);
  }

  async complete(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    event.isCompleted = true;
    event.isCancelled = false;
    event.isAborted = false;
    await this.eventRepository.save(event);
    return this.findOne(id);
  }

  /**
   * Bulk update participants' hasParticipated and award badges accordingly
   */
  async updateParticipantsStatus(
    eventId: string,
    dto: UpdateParticipantsStatusDto,
  ) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['badge', 'eventType', 'eventType.badge'],
    });
    if (!event) throw new NotFoundException('Event not found');

    const participant = await this.eventParticipant.findOne({
      where: { id: dto.participantId, eventId },
    });

    if (!participant) {
      return { updated: 0 };
    }

    // Update hasParticipated flag for single participant
    participant.hasParticipated = dto.hasParticipated;
    await this.eventParticipant.save(participant);

    // Award badges only when marking as participated (true)
    if (dto.hasParticipated) {
      const toAwardBadgeIds: string[] = [];
      if (event.badge?.id) toAwardBadgeIds.push(event.badge.id);
      if (event.eventType?.badge?.id)
        toAwardBadgeIds.push(event.eventType.badge.id);

      if (toAwardBadgeIds.length > 0) {
        const bikerId = participant.bikerId;
        for (const badgeId of toAwardBadgeIds) {
          const existing = await this.userBadgeRepo.findOne({
            where: { bikerId, badgeId },
          });
          if (existing) {
            existing.count = (existing.count ?? 1) + 1;
            await this.userBadgeRepo.save(existing);
          } else {
            const ub = this.userBadgeRepo.create({
              bikerId,
              badgeId,
              count: 1,
            });
            await this.userBadgeRepo.save(ub);
          }
        }
      }
    }

    return { updated: 1 };
  }

  /**
   * Kick a participant from event and reverse awarded badges for this event
   */
  async kickParticipant(eventId: string, participantId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['badge', 'eventType', 'eventType.badge'],
    });
    if (!event) throw new NotFoundException('Event not found');

    const participant = await this.eventParticipant.findOne({
      where: { id: participantId, eventId },
    });
    if (!participant) throw new NotFoundException('Participant not found');

    // Remove participant row
    await this.eventParticipant.delete({ id: participantId, eventId });

    // Reverse badges if any existed: remove event badge, decrement type badge
    const bikerId = participant.bikerId;

    // Remove event badge association (if exists)
    if (event.badge?.id) {
      const existingEventBadge = await this.userBadgeRepo.findOne({
        where: { bikerId, badgeId: event.badge.id },
      });
      if (existingEventBadge) {
        await this.userBadgeRepo.remove(existingEventBadge);
      }
    }

    // Decrement event type badge count or remove if reaches 0
    if (event.eventType?.badge?.id) {
      const typeBadge = await this.userBadgeRepo.findOne({
        where: { bikerId, badgeId: event.eventType.badge.id },
      });
      if (typeBadge) {
        const newCount = (typeBadge.count ?? 1) - 1;
        if (newCount > 0) {
          typeBadge.count = newCount;
          await this.userBadgeRepo.save(typeBadge);
        } else {
          await this.userBadgeRepo.remove(typeBadge);
        }
      }
    }

    return { kicked: true };
  }
}
