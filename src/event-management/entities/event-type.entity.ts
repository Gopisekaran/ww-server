import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { RideEvent } from './event.entity';
import { Badge } from '../../badge/entities/badge.entity';

@Entity('event_types')
export class EventType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => RideEvent, (event) => event.eventType)
  events: RideEvent[];

  @OneToOne(() => Badge, (badge) => badge.rideType)
  badge: Badge;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isOneDayEvent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
