import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { RideEvent } from '../../event-management/entities/event.entity';
import { EventType } from '../../event-management/entities/event-type.entity';
import { UserBadge } from './user-badges.entity';
import { BadgeLevel } from './badge-level.entity';

export enum BadgeCategory {
  COORDINATOR = 'COORDINATOR',
  ACHIEVEMENT = 'ACHIEVEMENT',
  RIDE = 'RIDE',
}

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({
    type: 'enum',
    enum: BadgeCategory,
  })
  category: BadgeCategory;

  /**
   * Big Ride Badge (1:1)
   */
  @OneToOne(() => RideEvent, (event) => event.badge, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rideEventId' })
  rideEvent?: RideEvent;

  @Column({ type: 'uuid', nullable: true, unique: true })
  rideEventId?: string;

  /**
   * Ride Type Badge (1:1)
   */
  @OneToOne(() => EventType, (type) => type.badge, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rideTypeId' })
  rideType?: EventType;

  @Column({ type: 'uuid', nullable: true, unique: true })
  rideTypeId?: string;

  /**
   * Only ride-type badges are repeatable
   */
  @Column({ default: false })
  isRepeatable: boolean;

  @OneToMany(() => UserBadge, (ub) => ub.badge)
  userBadges: UserBadge[];

  @OneToMany(() => BadgeLevel, (level) => level.badge, {
    cascade: true,
  })
  levels: BadgeLevel[];
}
