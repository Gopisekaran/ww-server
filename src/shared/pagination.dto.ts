import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Max(50)
  @Min(1)
  @Type(() => Number)
  limit: number;
}
