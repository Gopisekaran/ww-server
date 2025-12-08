import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { RideEvent } from './event.entity';
import { BikerProfile } from '../../biker-profile/entities/biker-profile.entity';

export type PaymentStatus = 'paid' | 'part' | 'unpaid';

@Entity('event_participants')
export class EventParticipant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => RideEvent, (event) => event.participants, { eager: false })
  @JoinColumn({ name: 'eventId' })
  event: RideEvent;

  @Column('uuid')
  eventId: string;

  @Index()
  @ManyToOne(() => BikerProfile, (biker) => biker.participations, {
    eager: true,
  })
  @JoinColumn({ name: 'bikerId' })
  biker: BikerProfile;

  @Column('uuid')
  bikerId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ default: false })
  hasParticipated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
