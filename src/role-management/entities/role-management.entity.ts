import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BikerProfile } from '../../biker-profile/entities/biker-profile.entity';

export enum UserRole {
  ADMIN = 'admin',
  moderator = 'moderator',
  member = 'member',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  name: string; // e.g., 'Admin', 'Member', 'Event Organizer'

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.member,
  })
  roleType: UserRole;

  @OneToMany(() => BikerProfile, (biker) => biker.role)
  bikers: BikerProfile[];
}
