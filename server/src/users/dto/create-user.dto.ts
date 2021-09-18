import { IsArray, IsString } from 'class-validator';
import { NotificationDto } from '../../notifications/dto/notification.dto';

export class CreateUserDto {
  readonly _id: string;

  @IsString()
  readonly ws_id: string;

  @IsArray()
  readonly blocklist: NotificationDto[];
}
