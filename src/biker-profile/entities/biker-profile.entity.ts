import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../role-management/entities/role-management.entity';
import { RideEvent } from '../../event-management/entities/event.entity';
import { EventParticipant } from '../../event-management/entities/event-participant.entity';
import { UserBadge } from '../../badge/entities/user-badges.entity';
import { Region } from './region.entity';

@Entity('biker_profiles')
export class BikerProfile {
  /**
   * Primary key: manually assigned UUID
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * Full name of the biker
   */
  @Column({ length: 100 })
  name: string;

  /**
   * Unique email address
   */
  @Column({ length: 100, unique: true })
  email: string;

  /**
   * WhatsApp contact number
   */
  @Column({ length: 15, unique: true })
  whatsappNumber: string;

  /**
   * Mobile contact number
   */
  @Column({ length: 15, unique: true })
  mobileNumber: string;

  /**
   * Whether the user has accepted the terms and conditions
   */
  @Column({ default: false })
  acceptTerms: boolean;

  /**
   * Native place (hometown)
   */
  @Column({ length: 100 })
  native: string;

  @Column({ length: 100, nullable: true })
  referredByName: string;

  /**
   * Current residence
   */
  @Column({ length: 100 })
  residing: string;

  /**
   * Date of birth
   */
  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'date', nullable: true })
  joiningDate: Date;

  /**
   * Blood group (e.g., O+, AB-)
   */
  @Column({ length: 3, nullable: true })
  bloodGroup: string;

  /**
   * Driving license number
   */
  @Column({ length: 30, nullable: true })
  drivingLicenseNumber: string;

  /**
   * Bike name and model
   */
  @Column({ length: 100 })
  bikeNameAndModel: string;

  /**
   * Biker gear list — stored as comma-separated values
   */
  @Column({ type: 'simple-array', default: [] })
  gears: string[];

  /**
   * Emergency contact person's full name
   */
  @Column({ length: 100, nullable: true })
  emergencyContactPersonName: string;

  /**
   * Emergency contact number
   */
  @Column({ length: 15, nullable: true })
  emergencyContactPersonNumber: string;

  /**
   * Indicates if the user has any medical alignment or condition
   */
  @Column({ default: false })
  isMedicalAlignment: boolean;

  @Column({ default: false })
  isActive: boolean;

  /**
   * Details about the medical condition (if any)
   */
  @Column({ type: 'text', nullable: true })
  medicalAlignmentDetails?: string;

  @Column({ type: 'text', nullable: true })
  profileImage?: string;

  @Column({ type: 'text', nullable: true })
  drivingLicenseLink: string;

  @Column({ type: 'text', nullable: true })
  aadharCardLink: string;

  /**
   * Self-referencing one-to-one relation to another biker who referred this user
   */
  @Index()
  @OneToOne(() => BikerProfile, { nullable: true })
  @JoinColumn({ name: 'referredById' })
  referredBy?: BikerProfile;

  /**
   * Column to hold the UUID of the referring biker
   */
  @Column({ type: 'uuid', nullable: true, unique: false })
  referredById?: string;

  @Index()
  @ManyToOne(() => Role, (role) => role.bikers, { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'uuid', nullable: true })
  roleId: string;

  @OneToMany(() => RideEvent, (event) => event.createdUser)
  events: RideEvent[];

  @OneToMany(() => EventParticipant, (ep) => ep.biker)
  participations: EventParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserBadge, (userBadge) => userBadge.biker)
  userBadges: UserBadge[];

  // biker-profile.entity.ts
  @ManyToOne(() => Region, (region) => region.profiles, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'regionId' })
  region: Region;

  @Column({ type: 'uuid', nullable: true, unique: false })
  regionId?: string;
}
