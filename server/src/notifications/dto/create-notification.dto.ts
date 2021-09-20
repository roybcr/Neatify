import { IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  readonly type: string;
  @IsString()
  readonly message: string;
}
