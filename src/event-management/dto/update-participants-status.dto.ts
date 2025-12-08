import { IsBoolean, IsUUID } from 'class-validator';

export class UpdateParticipantsStatusDto {
  @IsUUID('4')
  participantId!: string;

  @IsBoolean()
  hasParticipated!: boolean;
}
