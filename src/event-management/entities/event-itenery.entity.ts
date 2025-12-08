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

@Entity('event_itineraries')
export class RideEventItinerary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => RideEvent, (event) => event.itineraries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event: RideEvent;

  @Column('uuid')
  eventId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  mapLinks: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  kmToCover: number;

  @Column({ type: 'int', default: 1 })
  dayOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
