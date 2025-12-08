import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Badge } from './badge.entity';
import { BikerProfile } from '../../biker-profile/entities/biker-profile.entity';

@Entity('user_badges')
export class UserBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  badgeId: string;

  @ManyToOne(() => Badge, (badge) => badge.userBadges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'badgeId' })
  badge: Badge;

  // Only used for ride-type badges
  @Column({ default: 1 })
  count: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @CreateDateColumn()
  earnedAt: Date;

  @ManyToOne(() => BikerProfile, (biker) => biker.userBadges)
  @JoinColumn({ name: 'bikerId' })
  biker: BikerProfile;
}
