import { IsUUID } from 'class-validator';

export class KickParticipantDto {
  @IsUUID('4')
  participantId!: string;
}
