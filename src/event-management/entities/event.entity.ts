import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { EventType } from './event-type.entity';
import { EventParticipant } from './event-participant.entity';
import { BikerProfile } from '../../biker-profile/entities/biker-profile.entity';
import { RideEventItinerary } from './event-itenery.entity';
import { Badge } from '../../badge/entities/badge.entity';

@Entity('events')
export class RideEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ length: 20 })
  time: string;

  @Column({ type: 'text' })
  agenda: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  mapLink: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    nullable: true,
  })
  price: number;

  @Column({ default: false })
  isCancelled: boolean;

  @Column({ default: false })
  isAborted: boolean;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Index()
  @ManyToOne(() => EventType, (type) => type.events, { eager: true })
  @JoinColumn({ name: 'eventTypeId' })
  eventType: EventType;

  @Column('uuid')
  eventTypeId: string;

  @OneToMany(() => EventParticipant, (participant) => participant.event, {
    cascade: true,
  })
  participants: EventParticipant[];

  @Index()
  @ManyToOne(() => BikerProfile, (biker) => biker.events, { eager: true })
  @JoinColumn({ name: 'creatorId' })
  createdUser: Partial<BikerProfile>;

  @OneToMany(() => RideEventItinerary, (itinerary) => itinerary.event, {
    cascade: true,
  })
  itineraries: RideEventItinerary[];

  @Column('uuid')
  creatorId: string;

  @OneToOne(() => Badge, (badge) => badge.rideEvent)
  badge?: Badge;
}
