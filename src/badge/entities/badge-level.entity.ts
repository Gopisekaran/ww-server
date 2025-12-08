import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Badge } from './badge.entity';

@Entity('badge_levels')
export class BadgeLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Required

  @Column({ type: 'text' })
  description: string; // Required

  @Column()
  count: number; // Required - threshold to reach this level

  @Column()
  imageUrl: string; // required

  @ManyToOne(() => Badge, (badge) => badge.levels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'badgeId' })
  badge: Badge;

  @Column('uuid')
  badgeId: string;
}
