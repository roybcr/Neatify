import { IsString } from 'class-validator';

export class NotificationDto {
   readonly _id: string;
   @IsString()
   readonly type: string;
   @IsString()
   readonly message: string;
}
